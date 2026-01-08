export interface HblNavigationItem {
    id: string,
    name: string,
    url: string,
    children?: Array<HblNavigationItem>
}

export type HblNavigation = Array<HblNavigationItem> | null
