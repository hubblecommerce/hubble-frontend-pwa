<template>
    <div class="price-slider">
        <div class="price text-left" :class="priceMinSelected ? 'price-selected' : ''">
            <span v-text="curMinLabel" />
            <span v-text="curCurrencySign" />
        </div>

        <div class="price text-right" :class="priceMaxSelected ? 'price-selected' : ''">
            <span v-text="curMaxLabel" />
            <span v-text="curCurrencySign" />
        </div>

        <vue-slider
            v-if="loaded"
            ref="slider1"
            v-model="sliderValues"
            :min="initialMin"
            :max="initialMax"
            :clickable="false"
            :tooltip="false"
            :enable-cross="false"
            :min-range="10"
            @drag-end="onDragEnd"
        />
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'PriceSlider',

    components: {
        vueSlider: () => import('vue-slider-component'),
    },

    props: {
        dataMinValue: {
            default: 0,
            type: Number,
            required: true,
        },
        dataMaxValue: {
            default: 1,
            type: Number,
            required: true,
        },
        dataMinSelected: {
            default: 0,
            type: Number,
            required: true,
        },
        dataMaxSelected: {
            default: 1,
            type: Number,
            required: true,
        },
        filterOnChange: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            initialMin: 0,
            initialMax: 1,
            sliderValues: [0, 1],
            loaded: false,
        };
    },

    computed: {
        ...mapState({
            priceCurrency: state => state.modPrices.priceCurrency,
            priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol,
        }),
        curMinLabel: function () {
            return this.sliderValues[0];
        },
        curMaxLabel: function () {
            return this.sliderValues[1];
        },
        curCurrencySign: function () {
            return this.priceCurrencySymbol;
        },
        priceMinSelected() {
            return this.initialMin !== this.dataMinSelected;
        },
        priceMaxSelected() {
            return this.initialMax !== this.dataMaxSelected;
        }
    },

    created() {
        this.sliderValues = [this.dataMinSelected, this.dataMaxSelected];

        // as the slider is only 'created' once, when
        // initially loading the view component, we will
        // check for min/max selectable values and replace
        // the initial values here.
        if (this.dataMinValue !== this.initialMin) {
            this.initialMin = this.dataMinValue;
        }

        if (this.dataMaxValue !== this.initialMax) {
            this.initialMax = this.dataMaxValue;
        }
    },

    mounted() {
        this.loaded = true;
    },

    methods: {
        ...mapMutations({
            setSelectedPriceMin: 'modApiRequests/setSelectedPriceMin',
            setSelectedPriceMax: 'modApiRequests/setSelectedPriceMax',
        }),
        ...mapActions({
            applyFilter: 'modApiRequests/applyFilter',
        }),
        onDragEnd: function () {
            if (this.filterOnChange) {
                this.setSelectedPriceMin(this.sliderValues[0]);
                this.setSelectedPriceMax(this.sliderValues[1]);
                this.applyFilter();
            } else {
                this.setSelectedPriceMin(this.sliderValues[0]);
                this.setSelectedPriceMax(this.sliderValues[1]);
            }
        },
    },
};
</script>
