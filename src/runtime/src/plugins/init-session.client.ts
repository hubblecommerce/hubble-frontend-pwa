import { defineNuxtPlugin } from '#app'
import { usePlatform } from '#imports'

export default defineNuxtPlugin(async () => {
    const { getSession } = usePlatform()
    await getSession()
})
