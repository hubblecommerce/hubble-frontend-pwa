import { type NuxtApp } from '#app'

export function hblGetRequestCookie (app: NuxtApp, cookieName: string): string | null {
    const cookieHeader = app.ssrContext?.event.req.headers.cookie

    let cookie = null
    const value = `; ${cookieHeader}`
    const parts = value.split(`; ${cookieName}=`)
    if (parts.length === 2) {
        cookie = parts.pop()?.split(';').shift()
    }

    if (typeof cookie === 'undefined') {
        return null
    }

    return cookie
}
