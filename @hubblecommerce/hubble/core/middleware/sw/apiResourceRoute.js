import _ from 'lodash';

// Find product listing slot in api response construct: Section -> Block -> Slot
function findProductListingSlot(sections) {
    return new Promise(resolve => {
        sections.forEach(section => {
            section.blocks.forEach(block => {
                if(block.type === 'product-listing') {
                    block.slots.forEach(slot => {
                        if(slot.type === 'product-listing') {
                            resolve(slot);
                        }
                    });
                }
            });
        });
    });
}

export default async function ({ store, route, error }) {
    // Load detail page client side if its accessed via anchor
    if (store.getters['modApiProduct/getOpenDetail']) {
        store.commit('modApiResources/setPageType', 'product');
        return;
    }

    // remove leading '/'
    let pathValue = route.path.slice(1);

    // split 'path' into segments
    let segments = pathValue.split('/');

    // drop localization prefix
    if (segments[0].match(/^(en)$/)) {
        segments = _.drop(segments, 1);
    }

    const path = _.join(segments, '/');

    let associations = {
        "manufacturer": {
            "associations": {
                "media": {},
            },
        },
        "properties": {
            "associations": {
                "group": {}
            }
        },
        "media": {},
        "productReviews": {},
        "children": {
            "associations": {
                "options": {
                    "associations": {
                        "productOptions": {},
                        "group": {}
                    }
                }
            }
        },
        "options": {
            "associations": {
                "productOptions": {},
                "group": {}
            }
        },
        "categories": {},
        "seoUrls": {},
        "crossSellings": {},
    };

    let includes = {
        "cms_page_slot": [
            "id",
            "type",
            "slot",
            "blockId",
            "config",
            "data",
            "backgroundMediaMode",
            "backgroundMedia"
        ],
        "cms_page_block": [
            "slots",
            "type",
            "id",
            "backgroundColor",
            "backgroundMedia",
            "sectionPosition"
        ],
        "cms_page_section": [
            "id",
            "backgroundMedia",
            "blocks",
            "type",
            "sizingMode"
        ],
        "cms_page": [
            "id",
            "name",
            "sections",
            "type",
            "config"
        ],
        "product": [
            "media",
            "productReviews",
            "children",
            "name",
            "ratingAverage",
            "calculatedPrice",
            "calculatedPrices",
            "calculatedListingPrice",
            "cover",
            "parentId",
            "id",
            "translated",
            "options",
            "properties",
            "productNumber",
            "manufacturer",
            "seoUrls",
            "optionIds",
            "ean",
            "description",
            "stock",
            "available",
            "deliveryTime",
            "shippingFree",
            "crossSellings",
            "childCount"
        ],
        "product_media": [
            "media"
        ],
        "calculated_price": [
            "unitPrice",
            "quantity",
            "listPrice"
        ],
        "media": [
            "thumbnails",
            "width",
            "height",
            "url"
        ],
        "product_group_option": [
            "name",
            "id",
            "group",
            "translated"
        ],
        "product_group": [
            "id",
            "name",
            "options",
            "translated"
        ],
        "product_listing": [
            "sorting",
            "currentFilters",
            "elements",
            "page",
            "limit",
            "sortings",
            "availableSortings",
            "total",
            "aggregations"
        ],
        "property_group": [
            "id",
            "translated",
            "options",
            "filterable",
            "name"
        ],
        "property_group_option": [
            "name",
            "translated",
            "id",
            "colorHexCode",
            "media",
            "group"
        ],
        "category": [
            "active",
            "id",
            "name",
            "description",
            "metaTitle",
            "metaDescription",
            "keywords",
            "breadcrumb",
            "media",
            "level",
            "path"
        ]
    };

    const reqKeyMapping = [
        {
            reqParam: 'limit',
            postKey: 'limit'
        },
        {
            reqParam: 'sorting',
            postKey: 'order'
        },
        {
            reqParam: 'page',
            postKey: 'p'
        },
        {
            reqParam: 'manufacturer',
            postKey: 'manufacturer'
        },
        {
            reqParam: 'price_from',
            postKey: 'min-price'
        },
        {
            reqParam: 'price_to',
            postKey: 'max-price'
        },
        {
            reqParam: 'rating',
            postKey: 'rating'
        },
        {
            reqParam: 'shipping-free',
            postKey: 'shipping-free'
        },
        {
            reqParam: 'properties',
            postKey: 'properties'
        }
    ];

    let postData = {
        associations: associations,
        includes: includes,
        path: path
    };

    // Set request param to post data if isset in url
    reqKeyMapping.forEach(o => {
        if (route.query[o.reqParam] != null) {
            // Add comma separated options as array
            let arrOfValues = route.query[o.reqParam].split(',');
            if(arrOfValues.length > 1) {
                _.assign(postData, {
                    [o.postKey]: arrOfValues
                });
            } else {
                _.assign(postData, {
                    [o.postKey]: arrOfValues[0]
                });
            }
        }
    });

    try {
        let pageResponse = await store.dispatch('modApiResources/getPage', postData);

        // Category / CMS
        if (pageResponse.data.resourceType === 'frontend.navigation.page') {

            if(pageResponse.data.category != null) {
                let mappedCategoryData = await store.dispatch('modApiCategory/mappingCategory', pageResponse.data.category);

                store.commit('modApiCategory/setDataCategory', {
                    data: {
                        result: {
                            item: mappedCategoryData,
                        }
                    }
                });
            }

            const productListingSlot = await findProductListingSlot(pageResponse.data.cmsPage.sections);

            // If no products for this category set empty array as category products
            if (productListingSlot.data.listing.total === 0) {
                store.commit('modApiCategory/setDataCategoryProducts', {
                    data: {
                        result: [],
                    },
                });
            } else {
                const mappedCategoryProducts = await store.dispatch('modApiCategory/mappingCategoryProducts', productListingSlot.data.listing);

                store.commit('modApiCategory/setDataCategoryProducts', {
                    data: {
                        result: mappedCategoryProducts,
                    },
                });
            }

            store.commit('modApiResources/setPageType', 'category');

            return new Promise(resolve => {
                resolve();
            });
        }

        // Detail
        if (pageResponse.data.resourceType === 'frontend.detail.page') {
            store.commit('modApiProduct/setProductId', pageResponse.data.product.id);

            let mappedProduct = await store.dispatch('modApiProduct/mappingProduct', pageResponse.data);

            store.commit('modApiProduct/setDataProduct', {
                data: {
                    result: {
                        item: mappedProduct,
                    },
                },
            });

            store.commit('modApiResources/setPageType', 'product');

            return new Promise(resolve => {
                resolve();
            });
        }
    } catch (err) {
        console.log(err);
        error({ statusCode: 404, message: 'Unknown URL' });
    }
}
