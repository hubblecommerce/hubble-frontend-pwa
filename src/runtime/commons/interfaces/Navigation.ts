export interface NavigationItem {
    id: string,
    name: string,
    url: string,
    children?: Array<NavigationItem>
}

export type Navigation = Array<NavigationItem> | null
