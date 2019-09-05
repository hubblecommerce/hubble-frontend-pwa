<template>
    <div class="quantity-selector">
        <div class="hbl-select" v-show="!showInput">
            <select v-model="qtySelected" :class="dataClassSelect" :id="uuids[0]" class="select-text" required>
                <option value="" disabled selected></option>
                <option v-for="(item, index) in qtyOptions" :key="index" :value="item.value">{{ item.text }}</option>
            </select>
            <span class="select-highlight"></span>
            <span class="select-bar"></span>
            <label :for="uuids[0]" v-text="$t('Quantity')" class="select-label"></label>
        </div>
        <div class="hbl-input-group" v-show="showInput">
            <input aria-label="Menge" type="number" name="qty" size="7" :class="dataClassInput" v-model="qtySelected" :id="uuids[1]" required>
            <span class="highlight"></span>
            <span class="bar"></span>
            <label :for="uuids[1]" v-text="$t('Quantity')"></label>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: 'QtySelector',
                qtyOptions: [
                    { text: '1', value: 1 },
                    { text: '2', value: 2 },
                    { text: '3', value: 3 },
                    { text: '4', value: 4 },
                    { text: '5', value: 5 },
                    { text: '6', value: 6 },
                    { text: '7', value: 7 },
                    { text: '8', value: 8 },
                    { text: '9', value: 9 },
                    { text: '10', value: 10 },
                    { text: 'mehr', value: 'more' },
                ],
                qtySelected: 1,
                showInput: false,

				uuids: []
            }
        },

        props: {
            dataClassInput: {
                type: String,
                required: false,
                default: ''
            },
            dataClassSelect: {
                type: String,
                required: false,
                default: ''
            }
        },

		created() {
			this.uuids.push(this.guid());
		},

        watch: {
            qtySelected() {
                if(this.qtySelected === 'more') {
                    this.showInput = true;
                    this.qtySelected = this.qtyOptions[0].value;
                }

                // simply set parent's 'selectedQty' property
                this.$parent.selectedQty = parseInt(this.qtySelected, 10);
            }
        },

	methods: {
			 guid() {
				 function s4() {
					 return Math.floor((1 + Math.random()) * 0x10000)
						 .toString(16)
						 .substring(1);
				 }
				 return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			 }
		}
	}
</script>
