import { defineStore } from 'pinia'
import { useCookie, useRuntimeConfig } from '#app'
import { Session } from '../../commons'

export const useSessionStore = defineStore('sessionStore', {
    state: (): Session => {
        return {
            sessionToken: null
        }
    },
    actions: {
        setSessionToken (token: string) {
            this.sessionToken = token

            const { sessionCookie } = useRuntimeConfig()
            const cookie = useCookie(sessionCookie.name, sessionCookie.options)

            if (cookie.value !== token) {
                cookie.value = token
            }
        }
    }
})
