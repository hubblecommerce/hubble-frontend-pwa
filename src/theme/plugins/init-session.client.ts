import { defineNuxtPlugin } from '#imports'
import { usePlatform } from '#imports'

export default defineNuxtPlugin(async () => {
    const { getSession } = usePlatform()
    await getSession()
})
