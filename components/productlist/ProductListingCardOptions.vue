<template>
    <div>
        <div class="options-wrp">
            <div class="option-wrp color" v-for="(facet, index) in facetsAvail" :key="index" :updating="isUpdating">
                <div class="option-label" v-text="facet['facet-name']"></div>
                <div class="option-val-wrp">
                    <div v-for="(facetValue, vIndex) in facet['facet-values']"
                        :key="vIndex"
                        class="option-val"
                        :class="[facetValue.selected ? 'active' : '', 'not-active']"
                        @click="selectFacetOption(facet, facetValue)"
                        @mouseover="activeIndex = vIndex"
                        @mouseleave="activeIndex = null">
                        <div class="swatchable" v-html="getSwatchable(facetValue)"></div>
                        <div class="option-tooltip"
                            v-if="activeIndex === vIndex"
                            v-text="getFacetOptionLabel(facet, facetValue)"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import _ from 'lodash';

    export default {
        name: "ProductListingCardOptions",

        data() {
            return {
                itemLoaded: {},
                itemSelected: {},

                facetsAvail: {},
                facetsFilter: ['color_manufacturer'],

                isUpdating: false,

                uniqueOptions: {},

                showTooltip: false,

                activeIndex: null

                // options: [
                // 'color',
                // 'size'
                // ],
                // visibleChanger: [
                // 'color'
                // ],
                // mapping: {
                //     color: {
                //         53: 'green',
                //         58: 'red',
                //         60: 'yellow',
                //         49: 'black',
                //         50: 'blue',
                //         57: 'purple',
                //         56: 'orange',
                //         51: 'brown',
                //         52: 'grey'
                //     },
                //     size: {
                //         167: 'XS',
                //         168: 'S',
                //         169: 'M',
                //         170: 'L',
                //         171: 'XL',
                //         172: '28',
                //         173: '29',
                //         174: '30',
                //         175: '31',
                //         176: '32',
                //         177: '33',
                //         178: '34',
                //         179: '35'
                //     }
                // },
                // selected: undefined
            }
        },

        props: {
            item: {
                type: Object,
                required: true
            }
        },

        computed: {
            ...mapGetters({
                getSwatchesByOptionId: 'modSwatches/getSwatchesByOptionId'
            }),
            itemIsSimple() {
                return this.itemLoaded.type === 'simple';
            },
            itemIsGrouped() {
                return this.itemLoaded.type === 'grouped';
            },
            itemIsConfigurable() {
                return this.itemLoaded.type === 'configurable';
            },
            itemFacets() {
                let _facets = null;

                if(_.has(this.itemLoaded.facets, 'string_facets')) {
                    _facets = this.itemLoaded.facets['string_facets'];
                }

                return _facets;
            },
            itemFacetsSuper() {
                if(_.isEmpty(this.itemFacets)) {
                    return null;
                }

                let _facets = this.itemFacets.filter(item => item['type'] === 'super_attribute');

                // filter for wanted swatches
                if(! _.isEmpty(this.facetsFilter)) {
                    _facets = _facets.filter((item) => {
                        return _.includes(this.facetsFilter, item['code']);
                    })
                }

                return _facets;
            },
            itemFacetsSuperAllSelected() {
                let _allSelected = true;

                // loop through available facets
                _.forEach(this.facetsAvail, (facet) => {

                    // inform upper
                    if(! facet.selected) {
                        _allSelected = false;
                    }
                });

                return _allSelected;
            }
        },

        created() {
            // use copy of loaded item based on vuex store
            this.itemLoaded = this.item;

            // use copy of original loaded item,
            // but this might be changed by configuration
            this.itemSelected = this.itemLoaded;

            // use local copy of computed facets
            this.facetsAvail = this.itemFacetsSuper;

            // assign 'selected' (false) as default
            _.forEach(this.facetsAvail, (facet) => {

                facet.selected = false;

                _.forEach(facet['facet-values'], (facetValue) => {
                    facetValue.selected = false;
                });
            });

            // assign color and/or image properties in case of 'color_manufacturer'
            if(! _.isEmpty(this.itemFacetsSuper)) {
                if(! _.isEmpty(this.itemFacetsSuper.filter(item => item['code'] === 'color_manufacturer'))) {
                    this.assignFacetOptionValues('color_manufacturer');
                }
            }

        },

        methods: {
            getSwatchable(facetValue) {
                if(facetValue.use_color) {
                    let _html = '<div class="swatchable-color">';

                    _html += '<div style="background-color: ' + facetValue.use_color + ';"></div>';

                    _html += '</div>';

                    return _html;
                }
                else if(facetValue.use_image) {
                    return '<img src="' + facetValue.use_image + '" />';
                }
                else {
                    return '<div class="no-swatch"></div>';
                }
            },
            assignFacetOptionValues(facetCode) {
                let _facet = _.head(this.itemFacetsSuper.filter(item => item['code'] === facetCode));

                _.forEach(_facet['facet-values'], (facetValue) => {
                    let _option = this.getSwatchesByOptionId(facetCode, facetValue.id);

                    if(_.isEmpty(_option)) {
                        facetValue['use_color'] = null;
                        facetValue['use_image'] = null;
                    } else {
                        // assign values ...
                        facetValue['use_color'] = this.getFacetOptionColor(_option['small_color']);
                        facetValue['use_image'] = this.getFacetOptionImage(_option['small_image'], 'medium', 149);
                    }
                })
            },
            getFacetOptionColor(facetOptionColor) {
                if(facetOptionColor !== '') {
                    return facetOptionColor;
                }

                return null;
            },
            getFacetOptionImage(facetOptionImgName, facetOptionImgSize, facetCodeAttrId) {

                if(facetOptionImgName !== '') {
                    return _.join([
                        'https://www.design-bestseller.de/media/designbestseller_swatch',
                        facetCodeAttrId,
                        facetOptionImgSize,
                        facetOptionImgName
                        ], '/');
                }

                return facetOptionImgName;
            },
            selectFacetOption(facet, value) {

                // reset 'selected' of given facet values
                _.forEach(facet['facet-values'], (facetValue) => {
                    facetValue.selected = false;
                });

                // mark facet 'selected'
                facet.selected = true;

                // mark facet value 'selected'
                value.selected = true;

                // enforce re-rendering dom !!
                this.facetsAvail.push('nope');
                this.facetsAvail.pop();

                if(this.itemFacetsSuperAllSelected) {

                    let _item = _.head(
                        this.itemLoaded.search_result_data_children.filter(
                            child => child.id === value.product_id
                        )
                    );

                    // merge itemSelected onto loadedItem
                    // note: omit 'media_gallery' to ensure array
                    this.itemSelected = _.merge({}, this.itemLoaded, _.omit(_item, [
                        'type',
                        'media_gallery'
                    ]));

                    if(this.itemSelected.url_pds === null) {
                        this.itemSelected.url_pds = this.itemLoaded.url_pds;
                    }

                    if(_.isArray(_item.media_gallery)) {
                        this.itemSelected.media_gallery = _.merge({}, this.itemSelected.media_gallery, _item.media_gallery);
                    }
                    else {
                        let _media = {
                            position: 0,
                            disabled: 0,
                            label: _item.name,
                            value: _item.image
                        };

                        this.itemSelected.media_gallery.unshift(_media);
                    }

                    // emit update to the parent
                    this.$parent.$emit('update-item-data', this.itemSelected);
                }
            },
            getFacetOptionLabel(facet, value) {
                return value.label;
            },
            toggleTooltip: function() {
                this.showTooltip = true;
            },
            // getUniqueOptions: function() {
            //     let uniqueOptions = {};

            //     // Build object with options as properties
            //     this.options.forEach((option) => {
            //         uniqueOptions[option] = [];

            //         // Fill option properties with unique option values per variant
            //         this.children.forEach((child, index) => {
            //             if(uniqueOptions[option].includes(child[option]) === false && child[option] != null) {
            //                 uniqueOptions[option][index] = child[option];
            //             }
            //         });

            //         // Remove empty keys from array
            //         uniqueOptions[option] = uniqueOptions[option].filter(function (el) {
            //             return el != null;
            //         });

            //     });

            //     return uniqueOptions;
            // },
            // updateVariant: function(option, variant) {

            //     // Update current product data if option triggers relevant data
            //     if(this.visibleChanger.includes(option)) {
            //         this.$parent.$emit('update-variant', variant);

            //         // Set current variant for selected state classes
            //         this.selected = variant;
            //     }
            // },
            // setClasses: function(option, variant) {

            //     let classes = option;

            //     if(this.selected === variant ) {
            //         classes = classes + " active";
            //     }

            //     return classes;
            // }
        }
    };
    //
</script>
