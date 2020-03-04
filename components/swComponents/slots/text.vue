<template>
    <div class="">
        <div class="" v-html="rawHtml"></div>
    </div>
</template>

<script>
    export default {
        name: 'ShopwareText',
        components: {},
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            rawHtml() {
                return (
                    this.content &&
                    this.content.data &&
                    this.content.data.content
                );
            },
            verticalAlign() {
                return (
                    this.content &&
                    this.content.config &&
                    this.content.config.verticalAlign &&
                    this.content.config.verticalAlign.value
                );
            }
        }

    }
</script>

<style scoped>

</style>
