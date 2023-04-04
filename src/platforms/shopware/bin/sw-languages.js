#!/usr/bin/env node
/* eslint-disable */
import path from 'path'
import fse from 'fs-extra'
import { $fetch } from 'ofetch'
import { projectDir } from './sw-plugins-functions.js'

const languagesDirName = 'locales'
const languagesDir = path.join(projectDir, `/${languagesDirName}`)
const platformLanguagesFile = 'platformLanguages.json'

const main = async function () {
    try {
        await fse.ensureDir(languagesDir)
    } catch (e) {
        console.error('Failed to find ' + languagesDir)
        console.log(e)
        return e
    }

    let response = null
    try {
        response = await $fetch.raw(process.env.API_BASE_URL + '/language', {
            method: 'POST',
            headers: {
                'sw-access-key': process.env.API_SW_ACCESS_KEY
            }
        })
    } catch (e) {
        console.error('Failed to fetch languages')
        console.log(e)
        return e
    }

    let platformLangs = null
    if (response._data?.elements?.length > 0) {
        platformLangs = response._data.elements.map((lang) => {
            return {
                id: lang.id,
                code: lang.translationCode?.code,
                name: lang.translationCode?.translated?.name
            }
        })
    } else {
        console.error('Cannot find any languages, please check your saleschannel configs.')
        return false
    }

    try {
        await fse.writeJson(path.join(languagesDir, platformLanguagesFile), platformLangs)
    } catch (e) {
        console.error(`Could not write ${platformLanguagesFile} to ${languagesDir}`)
        console.log(e)
        return e
    }

    console.log(`${platformLanguagesFile} successfully created in ${languagesDir}`)

    return true
}

export default main
