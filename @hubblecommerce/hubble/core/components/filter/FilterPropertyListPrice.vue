<template>
    <div>
        <div class="price-range">
            <div class="price-range__values">
                <span>{{ minMaxPrice.min }} €</span>
                <span>-</span>
                <span>{{ minMaxPrice.max }} €</span>
            </div>

            <div class="price-range__bar">
                <div class="price-range__track" />
                <div
                    :style="{
                        left: `${leftSelect}%`,
                        width: `${rightSelect - leftSelect}%`
                    }"
                    class="price-range__track between"/>
                <div
                    :style="{left: `${leftSelect}%`}"
                    class="price-range__select"
                    data-dir="left"
                    @mousedown="onMouseDown" />
                <div
                    :style="{left: `${rightSelect}%`}"
                    class="price-range__select"
                    data-dir="right"
                    @mousedown="onMouseDown"/>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
         price: {
            type: Object,
            default: () => ({}),
        }
    },
    
    data() {
        return {
            barWidth: 0,
            selectWidth: 0,
            selectedButton: '',
            leftSelect: 0,
            rightSelect: 100,
        }
    },

    computed: {
        ...mapState({
            minMaxPriceStore: state => state.modFilter.minMaxPrice
        }),
        minMaxPriceAggr() {
            return {
                min: Math.floor(this.price.min),
                max: Math.ceil(this.price.max),
            }
        },
        minMaxPrice() {
            return {
                min: this.getProportionalPrice(this.leftSelect, 'floor'),
                max: this.getProportionalPrice(this.rightSelect, 'ceil')
            }
        },
    },

    mounted() {
        if (this.minMaxPriceStore.min != null) {
            this.leftSelect = this.getPercentage(this.minMaxPriceStore.min);
            this.rightSelect = this.getPercentage(this.minMaxPriceStore.max);
        }
    },
    
    methods: {
        getPercentage(val) {
            const { min, max } = this.minMaxPriceAggr;

            return (val - min) / (max - min) * 100;
        },
        
        getProportionalPrice(val, func) {
            if (func in Math == false) func = 'round'; // fallback
            const { min, max } = this.minMaxPriceAggr;

            return Math[func]((val / 100) * (max - min) + min);
        },
        
        onMouseDown(e) {
            this.onInteractionStart(e);
        },

        onInteractionStart(e) {
            const { dataset, offsetWidth } = e.target;

            this.barWidth = this.$el.clientWidth;
            this.selectWidth = offsetWidth;
            this.selectedButton = dataset.dir;

            this.addInteractionEvents();
        },

        addInteractionEvents() {
            window.addEventListener('mousemove', this.onInteractionMove);
			window.addEventListener('mouseup', this.onInteractionEnd);
        },

        removeInteractionEvents() {
            window.removeEventListener('mousemove', this.onInteractionMove);
			window.removeEventListener('mouseup', this.onInteractionEnd);
        },

        onInteractionMove(e) {
            this.setPosition(e);
        },

        onInteractionEnd() {
            this.removeInteractionEvents();
            this.$store.commit('modFilter/updatePrice', this.minMaxPrice);
        },

        setPosition(e) {
            const posX = e.pageX || e.touches[0].pageX;
            let offset;

            if (this.selectedButton === 'left') {
                offset = posX - this.$el.getBoundingClientRect().left - (this.selectWidth / 2);
            } else if (this.selectedButton === 'right') {
                offset = posX - this.$el.getBoundingClientRect().left + (this.selectWidth / 2);
            }

            const proportional = offset / this.barWidth;

            if (this.selectedButton === 'left') {
                this.leftSelect = Math.max(0, Math.min(proportional * 100, this.rightSelect));
            } else {
                this.rightSelect = Math.max(this.leftSelect, Math.min(100, proportional * 100));
            }
        }
    }
}
</script>

<style lang="scss">
$barHeight: 20px;

.price-range {
    width: 100%;

    &__bar {
        height: $barHeight;
        margin: 0 $barHeight / 2;
        position: relative;
        transform: translateX(-$barHeight / 2);
    }

    &__track {
        position: absolute;
        width: calc(100% + #{$barHeight});
        height: 3px;
        background: grey;
        top: 50%;
        transform: translateY(-50%);
        left: 0;

        &.between {
            background-color: blue;
            margin-left: $barHeight / 2;
        }
    }

    &__select {
        position: absolute;
        width: $barHeight;
        height: 100%;
        background: red;
        border-radius: 50%;
        padding: 0;
    }
}
</style>