import { Ref } from 'vue'
import { HblSalutation } from '@/utils/types/HblSalutation'
import { HblSession } from '@/utils/types/HblSession'
import { HblCountry } from '@/utils/types/HblCountry'

export interface HblIUsePlatform {
    loading: Ref<boolean>,
    error: Ref<boolean>,
    apiUrl: string,
    apiAuthToken: string,
    setSessionToken(token: string | null): void,
    getSession(): void,
    getSalutations(): Promise<HblSalutation[] | void>,
    getCountries(): Promise<HblCountry[] | void>,
    session: Ref<HblSession> | null,
    salutations: Ref<HblSalutation[] | null>,
    countries: Ref<HblCountry[] | null>,
    platformLanguages?: {
        route: string,
        id: string,
        key: string,
        name: string
    }[]
}
