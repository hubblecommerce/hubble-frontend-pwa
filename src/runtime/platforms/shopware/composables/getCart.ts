import { OpenAPI, SystemContextService } from '../api-client/generated'
import { useRuntimeConfig } from '#imports'

export const getCart = async () => {
    const runtimeConfig = useRuntimeConfig()

    OpenAPI.BASE = runtimeConfig.apiBaseUrl
    OpenAPI.HEADERS = {
        'sw-access-key': runtimeConfig.apiSwAccessKey
    }

    const { token } = await SystemContextService.readContext()

    return token
}
