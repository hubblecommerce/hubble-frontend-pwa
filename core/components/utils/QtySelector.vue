<template>
    <div class="quantity-selector">
        <div v-show="!qtyCartDisplay" class="qty-wrp">
            <input
                v-model="qtySelected"
                class="quantity"
                type="number"
                aria-label="Quantity"
                name="qty"
                step="1"
                min="1"
                max="maxQty"
                required
                @blur="qtyOnBlur()"
            />
            <div class="btn-wrp">
                <button class="qty-button" @click="increaseQty()">
                    <span class="increase" v-text="'+'" />
                </button>
                <button class="qty-button" @click="decreaseQty()">
                    <span class="decrease" v-text="'-'" />
                </button>
            </div>
        </div>
        <div v-show="qtyCartDisplay">
            <hbl-select>
                <select v-model="qtySelected" class="select-text" required :disabled="qtyOptions.length < 1">
                    <option value="" disabled selected />
                    <option v-if="qtyOptions.length < 1" value="1">1</option>
                    <option v-for="(item, index) in qtyOptions" :key="index" :value="item.value">{{ item.text }}</option>
                </select>
                <span class="select-highlight" />
                <span class="select-bar" />
                <label class="select-label" v-text="'Quantity'" />
            </hbl-select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QtySelector',

    props: {
        minQty: {
            type: Number,
            required: false,
            default: 1,
        },
        maxQty: {
            type: Number,
            required: true,
            default: 1,
        },
        type: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            name: 'QtySelector',
            qtyOptions: [],
            qtySelected: this.minQty,
            qtyCartDisplay: this.type,
        };
    },

    watch: {
        qtySelected() {
            if (this.qtySelected > this.maxQty) {
                this.qtySelected = this.maxQty;
            }

            // emit the Quantity to parent if it is a valid number between 1 and maxQty
            if (!isNaN(this.qtySelected) && this.qtySelected >= 1 && this.qtySelected <= this.maxQty) {
                this.$emit('changeQty', parseInt(this.qtySelected, 10));
            }
        },
    },

    created() {
        // Build array of options based on maxQty parameter
        if (this.maxQty > 0) {
            let i;
            for (i = 1; i <= this.maxQty; i++) {
                this.qtyOptions.push({ text: i, value: i });
            }
        } else {
            this.qtySelected = 0;
        }
    },

    methods: {
        qtyOnBlur: function () {
            if (this.qtySelected < 1) {
                this.qtySelected = 1;
            }
        },
        increaseQty: function () {
            this.qtySelected += 1;
        },
        decreaseQty: function () {
            if (this.qtySelected - 1 < 1) {
                return;
            }
            this.qtySelected -= 1;
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

$btn-icon-width: 33px;
$btn-icon-height: 50%;
$btn-background-color: $light-gray;
$btn-icon-color: $dark-gray;
$qty-selector-width: $btn-icon-width * 2.2;

.quantity-selector {
    max-width: $qty-selector-width;

    .qty-wrp {
        display: flex;
        height: 100%;

        .quantity {
            width: 100%;
            border: 1px solid $border-color;
            border-right: none;
            text-align: center;
            -moz-appearance: textfield;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }

        .btn-wrp {
            .qty-button {
                color: $btn-icon-color;
                font-size: 23px;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent;
                height: $btn-icon-height;
                width: $btn-icon-width;
                border: 1px solid $border-color;
                border-radius: unset;

                &:active {
                    background: $btn-background-color;
                }

                &:nth-child(n + 2) {
                    border-top: 0;
                }
            }
        }
    }
}
</style>
