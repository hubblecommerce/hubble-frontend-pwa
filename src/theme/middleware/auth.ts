import { defineNuxtRouteMiddleware } from '#imports'
import { useCustomer } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
    /*
     * Redirect to /customer/login if customer is not logged in
     */
    const customerStore = useCustomer()
    const { getCustomer } = customerStore

    try {
        await getCustomer()
    } catch (e) {
        return '/customer/login'
    }
})
