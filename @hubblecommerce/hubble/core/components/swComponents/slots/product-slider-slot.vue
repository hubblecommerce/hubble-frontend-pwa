<template>
    <div :class="elementClass">
        <div class="cms-element-alignment" :class="verticalAlign">
            <hooper ref="hooper" :settings="sliderSettings" style="height: auto">
                <slide v-for="(dataItem, index) in dataItems" :key="index" :index="index" :class="`sw-product-slider-item`">
                    <product-listing-card :item-data="dataItem" :show-desc="false" :show-badges="true" />
                </slide>
                <hooper-navigation slot="hooper-addons"></hooper-navigation>
            </hooper>
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
        margin: -8px;
    }
}
</style>