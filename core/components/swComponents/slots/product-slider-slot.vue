<template>
    <div :class="[elementClass, { 'is--full-width': sizingMode['full-width'] }]">
        <div :class="{ container: sizingMode['full-width'] }">
            <h2 v-if="title" class="cms-block-headline headline-1">{{ title }}</h2>
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
import { mappingCategoryProducts } from '@/utils/api-mapping-helper';
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
        title() {
            if (this.content.config && this.content.config.title) {
                return this.content.config.title.value;
            }

            return '';
        },
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
        this.dataItems = mappingCategoryProducts(this.content.data.products);
    },
};
</script>

<style lang="scss">
.cms-element-product-slider {
    &:not(.is--full-width) {
        .hooper-prev {
            left: 15px;
        }

        .hooper-next {
            right: 15px;
        }
    }

    &.is--full-width {
        overflow: hidden;

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

    .cms-element-alignment {
        position: relative;
    }

    .cms-element-title {
        font-weight: bold;
    }
}
</style>
