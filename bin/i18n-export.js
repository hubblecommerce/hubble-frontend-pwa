#!/usr/bin/env node
/* eslint-disable */
import fse from 'fs-extra'
import { resolve } from 'path'
import { projectDir } from '../dist/platforms/shopware/bin/sw-plugins-functions.js'
import { AsyncParser } from '@json2csv/node'

async function getAllFiles (dir) {
    const dirents = await fse.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name)
        return dirent.isDirectory() ? getAllFiles(res) : res
    }))
    return Array.prototype.concat(...files)
}

/*
Example Return Value:
{
  en: {
    'cart.actions.checkout': "Checkout 'escaped'",
    'cart.actions.offer': 'Request shopping cart',
    'cart.totals.title': 'Summary',
    'cart.coupons.title': 'Coupon',
    'cart.actions.editCart': 'Edit Cart',
    'cart.list.show': 'Show all',
    'cart.list.hide': "Don't show all"
  },
  de: {
    'cart.actions.checkout': 'Zur Kasse',
    'cart.actions.offer': 'Warenkorb anfragen',
    'cart.totals.title': 'Zusammenfassung',
    'cart.coupons.title': 'Gutschein',
    'cart.actions.editCart': 'Warekorb bearbeiten',
    'cart.list.show': 'Alle anzeigen',
    'cart.list.hide': 'Nicht alle anzeigen'
  }
}
*/
async function getI18nFromVueFile (path) {
    const file = await fse.readFileSync(path, 'UTF-8')

    const i18nPart = file.substring(
        file.indexOf('<i18n>') + 6,
        file.lastIndexOf('</i18n>')
    )

    if (i18nPart !== '') {
        try {
            return JSON.parse(i18nPart)
        } catch (e) {
            // console.log(e)
        }
    }
}

/*
Example Return Value:
const array = [
    {
        path: '../../',
        key: "cart.actions.checkout",
        en: "Checkout 'escaped'",
        de: "Zur Kasse"
    },
    {
        path: '../../',
        key: "cart.actions.offer",
        en: "Request shopping cart",
        de: "Warenkorb anfragen"
    }
]
*/
async function transformToCsv (obj, path) {
    let arr = []

    Object.keys(obj).map((langKey) => {
        Object.keys(obj[langKey]).map((entryKey) => {
            arr.push({
                path: path,
                key: entryKey,
                [langKey]: obj[langKey][entryKey]
            })
        })
    })

    return arr
}

function mergeObjectsOfArray (array, key) {
    let output = [];

    array.map(function(item) {
        const existing = output.filter(function(v, i) {
            return v[key] === item[key]
        })

        if (existing.length) {
            const existingIndex = output.indexOf(existing[0]);
            output[existingIndex] = { ...existing[0], ...item }
        } else {
            output.push(item);
        }
    });

    return output
}

const main = async function (args) {
    let components = []
    if (fse.existsSync(`${projectDir}/components`)) {
        components = await getAllFiles(`${projectDir}/components`)
    }
    let pages = []
    if (fse.existsSync(`${projectDir}/pages`)) {
        pages = await getAllFiles(`${projectDir}/pages`)
    }
    let layouts = []
    if (fse.existsSync(`${projectDir}/layouts`)) {
        layouts = await getAllFiles(`${projectDir}/layouts`)
    }
    const vueFiles = components.concat(pages, layouts)

    let array = []
    for (let vueFile of vueFiles) {
        const i18nObj = await getI18nFromVueFile(vueFile)

        if (i18nObj != null) {
            const csvArray = await transformToCsv(i18nObj, vueFile)
            array.push(...csvArray)
        }
    }

    const mergedArray = mergeObjectsOfArray(array, 'key')

    if (mergedArray.length) {
        const parser = new AsyncParser()
        const csv = await parser.parse(mergedArray).promise()
        const targetPath = args[1] != null ? args[1] : './translations.csv'
        fse.writeFileSync(targetPath, csv)

        console.log(`Success: Translations exported to ${targetPath}`)
    } else {
        console.log('No files found to be translated')
    }
}

export default main
