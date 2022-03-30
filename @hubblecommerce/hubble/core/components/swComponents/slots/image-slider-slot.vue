<template>
    <div :class="elementClass" class="sw-image-slider">
        <div class="cms-element-alignment" :class="verticalAlign">
            <client-only>
                <hooper :style="{ minHeight: getMinHeight }" :settings="sliderSettings">
                    <slide v-for="image in imageItems" :key="image.media.id">
                        <img :src="image.media.url" />
                    </slide>

                    <navigation slot="hooper-addons" />
                </hooper>
            </client-only>
        </div>
    </div>
</template>

<script>
import { Hooper, Slide, Navigation } from 'hooper';
import 'hooper/dist/hooper.css';
import { slotMixins } from '../helper';
export default {
    name: 'ImageSliderSlot',
    components: {
        Hooper,
        Slide,
        Navigation,
    },
    mixins: [slotMixins],

    data() {
        return {
            imageItems: [],

            sliderSettings: {
                wheelControl: false,
            },
        };
    },

    computed: {
        getMinHeight() {
            return this.content.config.minHeight.value;
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

    created() {
        this.imageItems = this.content.data.sliderItems;
    },
};
</script>

<style lang="scss">
.sw-image-slider {
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .img-lazy-wrp {
        .LazyImage {
            width: 100% !important;
        }
    }
}
</style>
