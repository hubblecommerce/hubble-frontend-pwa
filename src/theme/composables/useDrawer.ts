import { ref, Ref } from 'vue'
import { IUseDrawer } from '@hubblecommerce/hubble/commons'

const drawerState: Ref<boolean> = ref(false)
const drawerContext: Ref<string> = ref('')
const drawerDirection: Ref<'left' | 'right'> = ref('right')

export function useDrawer (): IUseDrawer {
    const toggleDrawer = function (context, direction) {
        if (direction) {
            drawerDirection.value = direction
        }

        drawerContext.value = drawerContext.value === '' ? context : ''
        drawerState.value = !drawerState.value
    }

    const closeDrawer = function () {
        drawerState.value = false
        drawerContext.value = ''
    }

    return {
        drawerState,
        drawerContext,
        drawerDirection,
        toggleDrawer,
        closeDrawer
    }
}
