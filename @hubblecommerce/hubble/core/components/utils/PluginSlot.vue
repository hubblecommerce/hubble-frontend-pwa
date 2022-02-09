<template>
    <div v-if="slotEntries != null">
        Slot: {{name}}
        <div v-for="slotEntry in slotEntries">
            Component name: {{ slotEntry.componentName }}
            Component: {{ slotEntry.component }}
            <component :is="slotEntry.componentName" :data="data" />
        </div>
    </div>

    <div v-else class="empty-slot" />
</template>

<script>
import { pluginMapping, generateImports } from '@/components/swPlugins/pluginMapping';

export default {
    name: "PluginSlot",

    props: {
        name: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            required: false,
            default: () => {}
        }
    },

    components: generateImports(),

    data() {
        return {
            slotEntries: null
        }
    },

    created() {
        this.slotEntries = pluginMapping.filter(entry => entry.slot === this.name);
    }
}
</script>

<style scoped>

</style>
