<template>
    <div v-if="slotEntries != null">
        <div v-for="slotEntry in slotEntries">
            <component :is="slotEntry.componentName" :data="data" />
        </div>
    </div>

    <div v-else class="empty-slot" />
</template>

<script>
import pluginMapping from "@/swPlugins/pluginMapping.json";

function generateImports() {
    let obj = {};

    if(pluginMapping != null && pluginMapping.pluginSlots != null) {
        pluginMapping.pluginSlots.map((plugin) => {
            Object.assign(obj, {
                [plugin.componentName]: () => import('@/components'+plugin.componentPath)
            });
        });
    }

    return obj;
}

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
        if(pluginMapping != null && pluginMapping.pluginSlots != null) {
            this.slotEntries = pluginMapping.pluginSlots.filter(entry => entry.slot === this.name);
        }
    }
}
</script>
