<template>
    <div v-if="slotEntries != null">
        <div v-for="slotEntry in slotEntries">
            {{ slotEntry.component }}
            <component :is="importComponent(slotEntry.component)" :data="data" />
        </div>
    </div>

    <div v-else class="empty-slot" />
</template>

<script>
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

    data() {
        return {
            slotEntries: null,
            pluginMapping: [
                {
                    "slot": "checkout-payment-methods-method",
                    "component": "../utils/Loader"
                },
                {
                    "slot": "checkout-payment-methods-modal",
                    "component": "../utils/Loader"
                },
                {
                    "slot": "checkout-payment-methods-method",
                    "component": "../utils/Loader"
                },
            ]
        }
    },

    created() {
        this.slotEntries = this.pluginMapping.filter(entry => entry.slot === this.name);
    },

    methods: {
        importComponent: function(path) {
            return () => import(path);
        }
    }
}
</script>

<style scoped>

</style>
