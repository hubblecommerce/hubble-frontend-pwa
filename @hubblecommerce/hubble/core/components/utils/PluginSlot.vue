<template>
    <div class="plugin-slot">
        <template v-if="slotEntries != null && slotEntries.length">
            <div v-for="slotEntry in slotEntries" class="plugin-slot-entries">
                <component
                    :is="slotEntry.componentName"
                    v-if="!hasSlotContent || (data && data.customFields)"
                    v-bind="data"
                    v-on="events" />

                <slot v-else />
            </div>
        </template>

        <slot v-else-if="hasSlotContent" />
        <div v-else class="empty-slot" />
    </div>
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
        },
        events: {
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

    computed: {
        hasSlotContent() {
            return this.$slots && this.$slots.default;
        }
    },

    created() {
        if(pluginMapping != null && pluginMapping.pluginSlots != null) {
            this.slotEntries = pluginMapping.pluginSlots.filter(entry => entry.slot === this.name);
        }
    }
}
</script>
