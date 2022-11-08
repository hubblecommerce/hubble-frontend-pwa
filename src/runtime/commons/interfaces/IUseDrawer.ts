import { Ref } from 'vue'

export interface IUseDrawer {
    drawerState: Ref<boolean>,
    drawerContext: Ref<string>,
    drawerDirection: Ref<'left' | 'right'>,
    toggleDrawer(context: string, direction?: 'left' | 'right'): void
    closeDrawer(): void
}
