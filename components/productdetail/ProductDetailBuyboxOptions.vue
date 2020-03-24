<template>
    <div class="options-wrp">
        <div v-for="(facet, index) in facetsAvail" :key="index" class="option-wrp" :class="facet" :updating="isUpdating">
            <div class="option-label option-label-top" v-text="facet['facet-name']" />
            <div v-if="!hasALotOfOptions(facet)" class="option-val-wrp">
                <div v-for="(facetValue, vIndex) in facet['facet-values']"
                     :key="vIndex"
                     class="option-val is-link"
                     :class="[facetValue.selected ? 'active' : '', 'not-active']" @click="selectFacetOption(facet, facetValue)"
                     v-text="getFacetOptionLabel(facet, facetValue)"
                />
            </div>
            <div v-if="hasALotOfOptions(facet)" class="select-wrp">
                <select v-model="selectedOption" @change="changeOption(facet)">
                    <option value="" disabled v-text="$t('Please select')" />
                    <option v-for="(facetValue, vIndex) in facet['facet-values']"
                            :key="vIndex"
                            class="option-val is-link"
                            :value="facetValue"
                            v-text="getFacetOptionLabel(facet, facetValue)"
                    />
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex';

    export default {
        name: "ProductDetailBuyboxOptions",

        data() {
            return {
                itemLoaded: {},
                itemSelected: {},

                facetsAvail: {},

                isUpdating: false,

                selectedOption: ''
            }
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiProduct.dataProduct
            }),
            ...mapGetters({
                getSwatchesByOptionId: 'modSwatches/getSwatchesByOptionId'
            }),
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

                return this.itemFacets.filter(item => item['type'] === 'super_attribute');
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
            this.itemLoaded = this.dataProduct.result.item;

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
            // if(! _.isEmpty(this.itemFacetsSuper.filter(item => item['facet-code'] === 'color_manufacturer'))) {
            //     this.assignFacetOptionValues('color_manufacturer');
            // }
        },

        methods: {
            ...mapMutations({
                setDataProductItem: 'modApiProduct/setDataProductItem'
            }),
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
                        '',
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
                        'model',
                        'description',
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

                    // Update current product data
                    this.setDataProductItem({
                        data: this.itemSelected
                    });
                }
            },
            changeOption: function(facet) {
                let value = this.selectedOption;
                this.selectFacetOption(facet, value);
            },
            getFacetOptionLabel(facet, value) {
                return value.label;
            },
            hasALotOfOptions: function(facet) {
                if(facet['facet-values'].length > 5) {
                    return true;
                }
                return false;
            }
        }
    };
</script>
