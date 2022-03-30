<template>
    <div class="plugin-slot">
        <template v-if="!hasChildSlots || (hasChildSlots && hasCustomPluginData)">
            <template v-if="slotEntries != null">
                <component :is="slotEntries[0].componentName" v-bind="data" v-on="events" />
            </template>

            <div v-else class="empty-slot" />
        </template>

        <slot v-else />
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
        hasChildSlots() {
            return this.$slots && this.$slots.default;
        },
        hasCustomPluginData() {
            if(pluginMapping != null && pluginMapping.pluginSlots != null) {
                const currentSlot = pluginMapping.pluginSlots.filter(entry => entry.slot === this.name);

                if (currentSlot.length) {
                    const namespace = currentSlot[0].pluginNamespace;
                    let containsNamespaceData = false;

                    if (this.data && this.data.customFields != null) {
                        Object.keys(this.data.customFields).forEach(key => {
                            if (key.includes(namespace)) containsNamespaceData = true;
                        })
                    }

                    return containsNamespaceData;
                }

                return false;
            }

            return false;
        }
    },

    created() {
        if(pluginMapping != null && pluginMapping.pluginSlots != null) {
            this.slotEntries = pluginMapping.pluginSlots.filter(entry => entry.slot === this.name);
        }
    }
}
</script>
