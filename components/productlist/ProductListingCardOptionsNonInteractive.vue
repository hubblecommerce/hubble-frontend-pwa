<template>
    <div class="options-wrp-non-interactive">
        <div v-for="(facet, facetIndex) in facetsShow" :class="'option '+facet.code" :key="facetIndex">
            <div v-for="(facetValue, facetValueIndex) in sortByKey(facet.values, 'value_id')"
                :key="facetValueIndex"
                v-if="checkStockQty(facetValue)"
                class="option-value"
                v-text="formatSize(facetValue.value_label)">
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "ProductListingCardOptionsNonInteractive",
        props: {
            item: {
                type: Object,
                required: true
            },
            facetCodes: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                facetsShow: {}
            }
        },
        created() {
            this.aggregateFacets();
        },
        computed: {
            facetsOrig: function() {
                return this.item;
            }
        },
        methods: {
            checkStockQty(facetValue) {
                // check property 'stock_qty' exists
                if(! _.has(facetValue, 'stock_qty')) {
                    return true;
                }

                return facetValue.stock_qty > 0;
            },
            sortByKey(sizes, key) {
                if(! _.isEmpty(sizes)) {

                    // dereference computed array
                    let _sizes = [].slice.call(sizes);

                    // simple asc sort by property (label)
                    _sizes = _.sortBy(_sizes, function(o) {
                        return parseFloat(o[key]);
                    });

                    return _sizes;
                }

                return null;
            },
            formatSize: function (size) {
                return size.replace('.0', '');
            },
            aggregateFacets: function() {
                if(this.facetsOrig.facets) {
                    let stringFacets = this.facetsOrig.facets.string_facets;

                    // group facets by attribute code
                    let facetsToShow = _.groupBy(stringFacets, 'code');

                    // filter (pick) wanted facets by codes
                    facetsToShow = _.pick(facetsToShow, this.facetCodes);

                    // remap filtered facets to objects (key, values)
                    facetsToShow = _.map(facetsToShow, (item, key) => {
                        return {
                            code: key,
                            values: item
                        }
                    });

                    this.facetsShow = facetsToShow;
                }
            }
        }
    };
</script>
