import { ref, type Ref } from 'vue'
import { type HblIUseDrawer } from '../types'

const drawerState: Ref<boolean> = ref(false)
const drawerContext: Ref<string> = ref('')
const drawerDirection: Ref<'left' | 'right'> = ref('right')

export function useDrawer (): HblIUseDrawer {
    const toggleDrawer = function (context: string, direction: 'left' | 'right') {
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

    useRuntimeHook('page:finish', () => {
        closeDrawer()
    })

    return {
        drawerState,
        drawerContext,
        drawerDirection,
        toggleDrawer,
        closeDrawer
    }
}
