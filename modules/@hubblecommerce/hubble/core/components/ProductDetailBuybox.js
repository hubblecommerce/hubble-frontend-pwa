import { mapState } from 'vuex'

export default {
    data() {
        return {
            name: 'ProductDetailBuybox',
            itemHasTierPrices: false,
            itemTierPriceDiscount: null
            // showTierPrices: false
        }
    },

    computed: {
        // Vuex
        ...mapState({
            dataProduct: state => state.modApiResources.dataProduct
        }),
        productData() {
            return this.dataProduct.result.item;
        },
        itemIsSimple() {
            return this.productData.type === 'simple';
        },
        itemIsGrouped() {
            return this.productData.type === 'grouped';
        },
        itemIsConfigurable() {
            return this.productData.type === 'configurable';
        }
    },

    mounted() {
        // evaludate tier price information
        //this.itemHasTierPrices = this.evalItemHasTierPrices();
        //this.itemTierPriceDiscount = this.evalItemsTierPriceDiscount();
    },

    methods: {
        // evalItemHasTierPrices() {

        //     // grouped products
        //     if(this.itemIsGrouped) {
        //         var _items = this.$children.filter(child => child.itemHasTierPrices);

        //         return ! _.isEmpty(_items);
        //     }

        //     // simple product
        //     var groupID = 0;
        //     return this.$store.getters['modPrices/productHasTierPricesByGroupId'](this.item, groupID);
        // },
        // evalItemsTierPriceDiscount() {

        //     // get all child nodes with tier price items
        //     var _items = this.$children.filter(child => child.itemHasTierPrices);

        //     if(! _.isEmpty(_items)) {
        //         var _max = _.maxBy(_items, 'itemTierPriceDiscount');

        //         return _max.itemTierPriceDiscount;
        //     }

        //     return null;
        // }
    },
};
