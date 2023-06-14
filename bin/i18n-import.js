#!/usr/bin/env node
/* eslint-disable */
import fse from 'fs-extra'
import csv from 'csvtojson'

/*
Example Return Value:
[
    {
        path: '../../.vue',
        i18n: {
            en: {
                'cart.key': 'English Text'
            }
            de: {
                'cart.key': 'deutscher Text'
            }
        }
    }
]
*/
async function transformToI18n (json) {
    const array = []
    json.map((entry) => {
        const { path, key, ...langs} = entry

        const i18n = {}
        Object.keys(langs).map((langKey) => {
            i18n[langKey] = {
                [key]: langs[langKey]
            }
        })

        const existing = array.filter(function(v, i) {
            return v['path'] === entry['path']
        })

        if (existing.length) {
            const existingIndex = array.indexOf(existing[0])
            Object.keys(existing[0].i18n).map((langKey) => {
                array[existingIndex].i18n[langKey] = { ...existing[0].i18n[langKey], ...i18n[langKey] }
            })
        } else {
            array.push({
                path: path,
                i18n: i18n
            });
        }
    })

    return array
}

const main = async function (args) {
    const filePath = args[1]

    if (filePath == null) {
        console.log('Error: Missing argument: path to csv file')
        return false
    }

    if (!fse.existsSync(filePath)) {
        console.log(`Error: ${filePath} could not be found, make sure path is correct and file exists.`)
        return false
    }

    try {
        const json = await csv().fromFile(filePath)
        if(!json.length) {
            return false
        }

        const array = await transformToI18n(json)

        for (let entry of array) {
            if (!fse.existsSync(entry.path)) {
                console.warn(`Warning: File with path ${entry.path} from csv could not be found`)
                return false
            }

            const file = await fse.readFileSync(entry.path, 'UTF-8')

            const i18nPart = file.substring(
                file.indexOf('<i18n>') + 6,
                file.lastIndexOf('</i18n>')
            )

            const replacedFile = await file.replace(i18nPart, '\n'+JSON.stringify(entry.i18n, null, 4)+'\n')

            fse.writeFileSync(entry.path, replacedFile)

            console.log(`Success: imported translations to ${entry.path}`)
        }

        console.log('Success: import finished')
    } catch (e) {
        console.log(e)
        return false
    }
}

export default main
