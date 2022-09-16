import { defineNuxtRouteMiddleware, navigateTo, useAsyncData } from '#app'
import { useCustomer } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
    const { getCustomer } = useCustomer()
    // TODO: Extract middleware to customer-index route? Auth is used just there
    // [Vue warn]: onServerPrefetch is called when there is no active component instance to be associated with.
    // Lifecycle injection APIs can only be used during execution of setup().
    // If you are using async setup(), make sure to register lifecycle hooks before the first await statement.
    const { data } = await useAsyncData(() => getCustomer(), { initialCache: false })

    if (data.value == null || data.value?.isGuest) {
        return navigateTo('/customer/login')
    } else {
        return true
    }
})
