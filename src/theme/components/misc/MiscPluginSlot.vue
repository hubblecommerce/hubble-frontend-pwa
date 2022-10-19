<template>
    <div class="plugin-slot">
        <!--<div class="text-xs p-2">Slot: {{ name }}</div>-->
        <template v-if="slotEntries != null && slotEntries.length">
            <div v-for="(slotEntry, index) in slotEntries" :key="index" class="plugin-slot-entries">
                <component
                    :is="resolveComponent(slotEntry.componentName)"
                    v-bind="data"
                    v-on="events"
                />
            </div>
        </template>

        <slot v-else-if="hasSlotContent" />
        <div v-else class="empty-slot" />
    </div>
</template>

<script setup lang="ts">
/*
* Naming convention for name property (Plugin Slot Naming Convention)
* 1. Dash-cased string of directory path based on projects root directory e.g.: layouts-default-...
* 2. Followed by dash-cased string consider the position of the slot within the component e.g.: navbar-before
*
* Examples:
* layouts-default-navbar-before
* pages-slug-dynamic-component-before
* components-product-product-detail-add-to-cart-after
*
* Component needs to be placed in a directory containing 'plugin' in path name
*/
import { ref, useSlots, computed, resolveComponent } from 'vue'
import { useRuntimeConfig } from '#app'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: false,
        default: () => { return false }
    },
    events: {
        type: Object,
        required: false,
        default: () => { return false }
    }
})

const slotEntries = ref(null)

const slots = useSlots()
const hasSlotContent = computed(() => {
    return slots && typeof slots.default === 'function' && slots.default()
})

const config = useRuntimeConfig()
const pluginMapping = config.public.pluginMapping

if (pluginMapping != null && pluginMapping.pluginSlots != null) {
    slotEntries.value = pluginMapping.pluginSlots.filter(entry => entry.slot === props.name)
}
</script>
