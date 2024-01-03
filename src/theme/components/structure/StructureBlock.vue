<template>
    <div ref="el" class="structure-block" :class="content.cssClass" :style="backgroundStyles">
        <component :is="component" :content="content.slots.length === 1 ? content.slots[0] : content.slots" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, defineAsyncComponent, resolveComponent, onMounted } from 'vue'
import { type HblBlock } from '@/utils/types'
import { hblToUpperCamelCase, hblRegisterIntersectionObserver, hblGetStructureBackgroundStyles } from '@/utils/helper'

const props = defineProps<{
    count?: number,
    content: HblBlock
}>()

const { backgroundStyles } = hblGetStructureBackgroundStyles(props.content)

const component = shallowRef()
// If block contains exactly one slot, directly load SLOT. If more than one slots then load BLOCK
const compName = computed(() => {
    let name = `StructureBlock${hblToUpperCamelCase(props.content.type)}`

    if (props.content.slots.length === 1) {
        name = `StructureSlot${hblToUpperCamelCase(props.content.slots[0].type)}`
    }

    return name
})

// Render first two section server side (SEO relevant hero elements)
// TODO: find a more generic way to mark elements a SEO relevant
if (props.count <= 1) {
    component.value = resolveComponent(`${compName.value}`)
}

// Lazy load other sections via intersection observer
const el = ref()
onMounted(() => {
    // TODO: find a more generic way to mark elements a SEO relevant
    if (props.count > 1) {
        hblRegisterIntersectionObserver(el.value, loadComponent)
    }
})

// For lazy loaded components
const loadComponent = function () {
    component.value = defineAsyncComponent({
        // the loader function
        loader: () => import(`./${props.content.slots.length === 1 ? 'slot' : 'block'}/${compName.value}.vue`)
    })
}
</script>
