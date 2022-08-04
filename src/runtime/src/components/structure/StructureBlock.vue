<template>
    <div ref="el" class="structure-block border border-gray-200" :class="content.cssClass" :style="backgroundStyles" style="min-height: 300px;">
        <component :is="component" :content="content.slots.length === 1 ? content.slots[0] : content.slots" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, defineAsyncComponent, resolveComponent, onMounted } from 'vue'
import { StructureLoading, StructureNoComponent } from '#components'
import { Block, toUpperCamelCase, registerIntersectionObserver, getStructureBackgroundStyles } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    count?: number,
    content: Block
}>()

const { backgroundStyles } = getStructureBackgroundStyles(props.content)

const component = shallowRef()
// If block contains exactly one slot, directly load SLOT. If more than one slots then load BLOCK
const compName = computed(() => {
    let name = `StructureBlock${toUpperCamelCase(props.content.type)}`

    if (props.content.slots.length === 1) {
        name = `StructureSlot${toUpperCamelCase(props.content.slots[0].type)}`
    }

    return name
})

// Render first section server side (SEO relevant hero elements)
// TODO: find a more generic way to mark elements a SEO relevant
if (props.count === 0) {
    component.value = resolveComponent(`${compName.value}`)
}

// Lazy load other sections via intersection observer
const el = ref()
onMounted(() => {
    // TODO: find a more generic way to mark elements a SEO relevant
    if (props.count > 0) {
        registerIntersectionObserver(el.value, loadComponent)
    }
})

// For lazy loaded components
const loadComponent = function () {
    component.value = defineAsyncComponent({
        // the loader function
        loader: () => import(`./${props.content.slots.length === 1 ? 'slot' : 'block'}/${compName.value}.vue`),

        // A component to use while the async component is loading
        loadingComponent: StructureLoading,

        // Delay before showing the loading component. Default: 200ms.
        delay: 200,

        // A component to use if the load fails
        errorComponent: StructureNoComponent,

        // The error component will be displayed if a timeout is
        // provided and exceeded. Default: Infinity.
        timeout: 3000
    })
}
</script>
