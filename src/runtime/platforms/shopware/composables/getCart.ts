import { SystemContextShopware } from '../api-client/generated'

export const getCart = async () => {
    const { token } = await SystemContextShopware.readContext()

    return token
}
