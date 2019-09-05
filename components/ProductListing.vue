<template>
    <div class="listing-wrp row">

        <template v-if="isSlider">
            <no-ssr>
                <slider
                    :responsive=responsive
                    :controlsText=controls
                    :loop="true"
                    :gutter="10"
                >
                    <template v-for="(item, index) in dataItems">
                        <div class="slider-item" :key="index">
                            <product-listing-card :item-orig="item" :key="item.id" :is-slider="isSlider"></product-listing-card>
                        </div>
                    </template>
                </slider>
            </no-ssr>
        </template>

        <div v-if="!isSlider" class="listing-item col-6 col-sm-6 col-md-4 col-lg-3" v-for="(item, index) in dataItems" :key="index">
            <product-listing-card :item-orig="item" :key="item.id"></product-listing-card>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'ProductListing',
        props: {
            dataItems: {
                type: Array,
                required: true
            },
            isSlider: {
                type: Boolean,
                default: false,
                required: false
            },
            responsive: {
                type: Object,
                required: false,
                default() {
                    return {
                        0: {
                            items: 2,
                            mouseDrag: true,
                            controls: false
                        },
                        500: {
                            items: 2
                        },
                        1000: {
                            items: 4,
                            controls: true,
                            mouseDrag: false
                        }
                    }
                }
            }
        },
        data () {
            return {
                controls: ['<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>', '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>']
            }
        },
        computed: {
            classes() {
                return [
                    ! this.isSlider ? 'columns is-flex is-multiline' : ''
                ];
            }
        }
    }
</script>
