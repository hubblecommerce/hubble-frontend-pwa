<template>
    <div
        v-if="iconData != null"
        :class="`${type} ${type}-${icon} is-${size}`"
        v-html="iconData"
    />
</template>

<script>
export default {
    name: "SvgIcon",

    props: {
        icon: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: false,
            default: "md",
        },
        dir: {
            type: String,
            required: false,
            default: "icons",
        },
        type: {
            type: String,
            required: false,
            default: "icon",
        }
    },

    data() {
        return {
            iconData: null,
        };
    },

    async created() {
        this.iconData = await this.getIcon();
    },

    methods: {
        getIcon: async function () {
            const imp = await import(
                `~/assets/${this.dir}/${this.icon}.svg?raw`
            );

            return imp.default;
        },
    },
};
</script>
