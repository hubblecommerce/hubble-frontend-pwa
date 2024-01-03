import { type Ref } from 'vue'
import { type HblSalutation } from '@/utils/types/HblSalutation'
import { type HblSession } from '@/utils/types/HblSession'
import { type HblCountry } from '@/utils/types/HblCountry'

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
