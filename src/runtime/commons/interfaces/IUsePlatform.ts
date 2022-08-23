import { Ref } from 'vue'
import { Salutation } from './Salutation'
import { Session } from './Session'
import { Country } from './Country'

export interface IUsePlatform {
    loading: Ref<boolean>,
    error: Ref<boolean>,
    apiUrl: string,
    apiAuthToken: string,
    sessionToken: Ref<string> | null,
    setSessionToken(token: string): void,
    getSession(): void,
    getSalutations(): Promise<Salutation[]>,
    getCountries(): Promise<Country[]>,
    session: Ref<Session | null>,
    salutations: Ref<Salutation[] | null>,
    countries: Ref<Country[] | null>
}
