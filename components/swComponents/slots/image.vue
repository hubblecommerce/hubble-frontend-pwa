<template>
    <div class="sw-image">
        <img-lazy :src="imgUrl" :alt-info="alt" :title-info="title" />
    </div>
</template>

<script>
    export default {
        name: 'ShopwareImage',
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            getMedia() {
                return this.content && this.content.data && this.content.data.media
            },
            imgUrl() {
                return this.getMedia && this.getMedia.url
            },
            alt() {
                return this.getMedia && this.getMedia.alt
            },
            title() {
                return this.getMedia && this.getMedia.title
            }
        }

    }
</script>

<style lang="scss" scoped>
    /*.sw-image {
        position: relative;
        display: flex;
        justify-content: center;
    }*/
</style>
