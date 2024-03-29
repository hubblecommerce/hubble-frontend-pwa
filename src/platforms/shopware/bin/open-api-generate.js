#!/usr/bin/env node
/* eslint-disable */
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { $fetch } from 'ofetch'
import { generate } from 'openapi-typescript-codegen'
import { config } from 'dotenv'
import path from 'path'

const playgroundPath = path.resolve(path.join(process.env.INIT_CWD, 'playground'))
const playgroundExists = await fse.pathExists(playgroundPath)

if (playgroundExists) {
    config({ path: `${playgroundPath}/.env` })
} else {
    config()
}

class ShopwareClient {
    constructor (options) {
        this.baseURL = options.baseURL
        this.client_id = options.client_id
        this.client_secret = options.client_secret
        this.access_key = options.access_key
        this.apiFetch = $fetch.create({ baseURL: this.baseURL })
        this.accessToken = null
    }

    async auth () {
        try {
            const response = await this.apiFetch('/api/oauth/token', {
                method: 'POST',
                body: {
                    grant_type: 'client_credentials',
                    client_id: this.client_id,
                    client_secret: this.client_secret
                }
            })
            if (response) {
                this.access_token = response.access_token
                return true
            } else {
                return false
            }
        } catch (error) {
            throw error
        }
    }

    async getClientDefinition () {
        try {
            const spec = await this.apiFetch('/store-api/_info/openapi3.json', {
                headers: {
                    Authorization: `Bearer ${this.access_token}`,
                    'sw-access-key': this.access_key
                }
            })

            /*
             * hotfix for https://github.com/bluewire-solutions/shopware-6-api-client/issues/3
             * caused by https://issues.shopware.com/issues/NEXT-15412
             */
            spec.components.schemas.relationshipLinks = {
                description: 'A resource object **MAY** contain references to other resource objects ("relationships"). Relationships may be to-one or to-many. Relationships can be specified by including a member in a resource\'s links object.',
                properties: {
                    self: {
                        allOf: [
                            {
                                description: 'A `self` member, whose value is a URL for the relationship itself (a "relationship URL"). This URL allows the client to directly manipulate the relationship. For example, it would allow a client to remove an `author` from an `article` without deleting the people resource itself.',
                                type: 'array'
                            },
                            {
                                $ref: '#/components/schemas/link'
                            }
                        ]
                    },
                    related: {
                        $ref: '#/components/schemas/link'
                    }
                },
                type: 'object',
                additionalProperties: true
            }

            spec.components.responses.ContextTokenResponse = {
                type: "object",
                properties: {
                    contextToken: {
                        description: "Context token identifying the current user session.",
                        type: "string"
                    }
                }
            }

            const specTargetLocation = fileURLToPath(new URL('../api-client/openapi3.json', import.meta.url))
            const data = JSON.stringify(spec)
            fse.writeFileSync(specTargetLocation, data)
        } catch (error) {
            throw error
        }
    }

    async openApiGenerate () {
        const specTargetLocation = fileURLToPath(new URL('../api-client/openapi3.json', import.meta.url))
        const genTargetLocation = fileURLToPath(new URL('../api-client/generated', import.meta.url))

        await generate({
            input: specTargetLocation,
            output: genTargetLocation,
            request: fileURLToPath(new URL('../api-client/request.ts', import.meta.url)),
            postfixServices: 'Shopware',
            useUnionTypes: true
        })
    }
}

const main = async function (args) {
    try {
        // TODO: read params from .env file of playground
        const client = new ShopwareClient({
            baseURL: process.env.PLATFORM_BASE_URL,
            client_id: process.env.API_CLIENT_ID,
            client_secret: process.env.API_CLIENT_SECRET,
            access_key: process.env.API_SW_ACCESS_KEY
        })

        await client.auth()
        await client.getClientDefinition()
        await client.openApiGenerate()
    } catch (e) {
        console.log(e)
    }
}

export default main
