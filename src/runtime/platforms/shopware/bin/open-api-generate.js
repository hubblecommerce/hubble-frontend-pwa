#!/usr/bin/env node
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
import { $fetch } from 'ohmyfetch'
import { generate } from 'openapi-typescript-codegen'

class ShopwareClient {
    constructor (options) {
        this.baseURL = options.baseURL
        this.client_id = options.client_id
        this.client_secret = options.client_secret
        this.apiFetch = $fetch.create({ baseURL: this.baseURL })
        this.accessToken = null
    }

    async auth () {
        // eslint-disable-next-line no-useless-catch
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
        // eslint-disable-next-line no-useless-catch
        try {
            const spec = await this.apiFetch('/store-api/_info/openapi3.json', {
                headers: { Authorization: `Bearer ${this.access_token}` }
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
            postfix: 'Shopware',
            useUnionTypes: true
        })
    }
}

const main = async function (args) {
    try {
        const client = new ShopwareClient({
            baseURL: args[2], // 'http://localhost'
            client_id: args[3], // 'SWIAZKDRWJQYAFVBSXFPCNM5QG'
            client_secret: args[4] // 'S1ZVMkV5cnh6TFdWbmFkQmJMUDVraFlhSjFMOHdnbHZTdUtKeEg'
        })

        await client.auth()
        await client.getClientDefinition()
        await client.openApiGenerate()
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
    }
}

export default main
