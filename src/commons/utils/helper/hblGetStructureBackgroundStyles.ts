import { computed, Ref } from 'vue'
import { HblSection, HblBlock } from '@/utils/types'

export function hblGetStructureBackgroundStyles (content: HblSection | HblBlock): { backgroundStyles: Ref<string> } {
    const backgroundStyles: Ref<string> = computed(() => {
        let styles = ''

        if (content.backgroundColor != null) {
            styles = `background-color: ${content.backgroundColor}; `
        }

        if (content.backgroundMedia != null) {
            styles = `background: url('${content.backgroundMedia.url}'); `
        }

        if (content.backgroundMediaMode != null) {
            styles += `background-size: ${content.backgroundMediaMode}; `
        }

        return styles
    })

    return {
        backgroundStyles
    }
}
