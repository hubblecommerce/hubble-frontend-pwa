export interface Session {
    sessionToken: string | null,
    currency?: string,
    language?: string,
    maintenance?: boolean,
    shippingMethod?: string,
    paymentMethod?: string
}
