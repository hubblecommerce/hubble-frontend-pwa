<template>
    <div :class="[elementClass, { 'is--full-width': sizingMode['full-width'] }]">
        <div :class="{ container: sizingMode['full-width'] }">
            <div class="cms-element-alignment" :class="verticalAlign">
                <hooper ref="hooper" :settings="sliderSettings" style="height: auto">
                    <slide v-for="(dataItem, index) in dataItems" :key="index" :index="index" :class="`sw-product-slider-item`">
                        <product-listing-card :item-data="dataItem" :show-desc="false" :show-badges="true" />
                    </slide>
                    <hooper-navigation slot="hooper-addons">
                        <svg-icon slot="hooper-prev" icon="arrow-left" />
                        <svg-icon slot="hooper-next" icon="arrow-right" />
                    </hooper-navigation>
                </hooper>
            </div>
        </div>
    </div>
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import { slotMixins } from '../helper';
import 'hooper/dist/hooper.css';

export default {
    name: 'ProductSliderSlot',
    
    components: {
        Hooper,
        Slide,
        HooperNavigation,
    },
    
    mixins: [slotMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
        sizingMode: {
            type: Object,
            default: () => {}
        },
    },

    data() {
        return {
            dataItems: [],
            sliderSettings: {
                itemsToShow: 1,
                wheelControl: false,
                keysControl: false,
                mouseDrag: false,
                infiniteScroll: true,
                breakpoints: {
                    376: {
                        itemsToShow: 2,
                    },
                    768: {
                        itemsToShow: 3,
                    },
                    1024: {
                        itemsToShow: 4,
                    },
                },
            },
        };
    },

    computed: {
        verticalAlign() {
            if (this.content.config && this.content.config.verticalAlign) {
                if (this.content.config.verticalAlign.value === 'center') {
                    return 'align-self-center';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-end';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-start';
                }
            }
            return '';
        },
    },

    mounted() {
        this.dataItems = this.content.data.products
    },
};
</script>

<style lang="scss">
.cms-element-product-slider {
    .cms-element-alignment {
        position: relative;
        margin: -10px;
    }

    &.is--full-width {
        .cms-element-alignment {
            &::before,
            &::after {
                content: '';
                position: absolute;
                top: 0;
                height: 100%;
                width: 100%;
                background: white;
                opacity: 0.7;
                z-index: 1;
            }

            &::before {
                right: 100%;
            }

            &::after {
                left: 100%;
            }
        }

        .hooper-list {
            overflow: visible;
        }
    }
}
</style>