<template>
    <div class="quantity-selector">
        <div v-show="!showInput" class="hbl-select">
            <select v-model="qtySelected" class="select-text" required>
                <option value="" disabled selected />
                <option v-for="(item, index) in qtyOptions" :key="index" :value="item.value">{{ item.text }}</option>
            </select>
            <span class="select-highlight" />
            <span class="select-bar" />
            <label class="select-label" v-text="$t('Quantity')" />
        </div>
        <div v-show="showInput" class="hbl-input-group">
            <input
                id="quantity"
                v-model="qtySelected"
                aria-label="Menge"
                type="number"
                name="qty"
                step="1"
                min="1"
                max="maxQty"
                required
                @blur="qtyOnBlur()"
            />
            <span class="highlight" />
            <span class="bar" />
            <label for="quantity" v-text="$t('Quantity')" />
        </div>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'QtySelector',

    props: {
        qty: {
            type: Number,
            required: false,
            default: 1,
        },
        maxQty: {
            type: Number,
            required: true,
            default: 1,
        },
        showMore: {
            type: Boolean,
            required: false,
        },
    },

    data() {
        return {
            name: 'QtySelector',
            qtyOptions: [],
            qtySelected: this.qty,
            showInput: this.qty > 10,
        };
    },

    watch: {
        qtySelected() {
            if (this.qtySelected === 'more') {
                this.showInput = true;
                this.qtySelected = this.qtyOptions[0].value;
            }

            if (this.qtySelected > this.maxQty) {
                this.qtySelected = this.maxQty;
            }

            // emit the Quantity to parent if it is a valid number between 1 and maxQty
            if (!_.isNaN(this.qtySelected) && this.qtySelected >= 1 && this.qtySelected <= this.maxQty) {
                this.$emit('changeQty', _.parseInt(this.qtySelected, 10));
            }
        },
    },

    created() {
        // Build array of options based on maxQty parameter
        let i;
        for (i = 1; i <= this.maxQty; i++) {
            this.qtyOptions.push({ text: i, value: i });
        }

        if (this.showMore) {
            this.qtyOptions.push({ text: 'mehr', value: 'more' });
        }
    },

    methods: {
        qtyOnBlur: function () {
            if (this.qtySelected < 1) {
                this.qtySelected = 1;
            }
        },
    },
};
</script>
