function mappingCategory(payload) {
    let obj = {};

    obj.id = payload.id;
    obj.name = payload.name;

    if (payload.media != null) {
        obj.image = payload.media.url;
    }

    obj.description = payload.description;
    obj.teaser = payload.description;
    obj.meta_title = payload.metaTitle;
    obj.meta_keywords = payload.keywords;
    obj.meta_description = payload.metaDescription;
    obj.level = payload.level;

    return obj;
}

function mappingBreadcrumb(payload) {
    let arr = [];

    Object.keys(payload).forEach((key) => {
        arr.push({
            name: payload[key].name,
            url: payload[key].path,
        });
    });

    return arr;
}

function mappingCategoryProducts(products) {
    let mapped = [];

    products.forEach((product) => {
        let obj = {};

        obj.id = product.id;
        obj.ean = product.ean;
        obj.type = product.sw;

        if (product.markAsTopseller != null) {
            obj.markAsTopseller = product.markAsTopseller;
        }
        if (product.isNew != null) {
            obj.isNew = product.isNew;
        }

        obj.cover = product.cover;

        obj.name = product.translated.name;
        obj.description = product.translated.description;
        obj.meta_title = product.metaTitle;
        obj.meta_keywords = product.keywords;
        obj.meta_description = product.metaDescription;
        if (product.manufacturer !== null) {
            obj.manufacturer_id = product.manufacturer.id;
            obj.manufacturer_name = product.manufacturer.name;
        }

        if (product.seoUrls !== null) {
            obj.seoUrls = product.seoUrls;
        }

        obj.stock_item = {
            qty: product.stock,
            is_in_stock: product.available,
        };

        obj.calculatedPrice = product.calculatedPrice;
        obj.calculatedListingPrice = product.calculatedCheapestPrice;

        if (product.calculatedCheapestPrice != null) {
            obj.fromPrice = product.calculatedCheapestPrice.totalPrice;
        }

        if (product.calculatedPrice.listPrice !== null) {
            obj.listPrice = product.calculatedPrice.listPrice;
        }

        if (product.calculatedPrice != null) {
            obj.unitPrice = product.calculatedPrice.unitPrice;
        }

        if (product.translated.customFields.product_variants_extension) {
            obj.variants = product.translated.customFields.product_variants_extension.elements;
        }

        // Will be deprecated, use price properties above instead
        obj.final_price_item = {
            special_to_date: null,
            special_from_date: null,
            display_price_netto: product.calculatedPrice.unitPrice,
            display_price_netto_special: null,
            display_price_brutto: product.calculatedPrice.unitPrice,
            display_price_brutto_special: null,
            priceinfo: null,
            tax_class_id: 1,
        };

        mapped.push(obj);
    });

    return mapped;
}

function mappingProduct(payload) {
    let obj = {};

    let product = payload.product;

    obj.active = product.available;
    obj.id = product.id;
    obj.sku = product.productNumber;
    obj.type = 'simple';

    if (product.optionIds !== null) {
        obj.type = 'configurable';
    }

    if (product.cover != null) {
        obj.image = product.cover.media.url;
    }

    obj.cover = product.cover;

    obj.name = product.translated.name;
    obj.description = product.translated.description;
    obj.meta_title = product.metaTitle;
    obj.meta_keywords = product.keywords;
    obj.meta_description = product.metaDescription;

    if (product.manufacturer != null) {
        obj.manufacturer_id = product.manufacturer.id;
        obj.manufacturer_name = product.manufacturer.name;

        obj.manufacturer_item = {
            url: product.manufacturer.link,
            name: product.manufacturer.name,
        };

        if (product.manufacturer.media !== null) {
            obj.manufacturer_item.logo = product.manufacturer.media.url;
        }
    }

    obj.name_orig = product.translated.name;

    if (product.seoUrls && product.seoUrls.length > 0) {
        obj.url_pds = product.seoUrls[product.seoUrls.length - 1].seoPathInfo;
    } else {
        obj.url_pds = 'detail/' + product.id;
    }

    obj.stock_item = {
        qty: product.availableStock,
        minPurchase: product.minPurchase,
        maxPurchase: product.maxPurchase,
        purchaseSteps: product.purchaseSteps,
        is_in_stock: false,
    };

    if (product.isCloseout && product.availableStock > 0) {
        obj.stock_item.is_in_stock = true;
    }

    if (!product.isCloseout) {
        obj.stock_item.is_in_stock = true;
    }

    if (product.calculatedPrice != null) {
        obj.calculatedPrice = product.calculatedPrice;
    }

    obj.final_price_item = {
        special_to_date: null,
        special_from_date: null,
        display_price_netto: product.calculatedPrice.unitPrice,
        display_price_netto_special: null,
        display_price_brutto: product.calculatedPrice.unitPrice,
        display_price_brutto_special: null,
        priceinfo: null,
        tax_class_id: 1,
    };

    if (product.calculatedPrices != null) {
        obj.calculatedPrices = product.calculatedPrices;
    }

    if (product.deliveryTime !== null) {
        obj.delivery_time = product.deliveryTime;
    }

    obj.shipping_free = product.shippingFree;

    if (product.media != null) {
        obj.media = product.media.sort(function (a, b) {
            return a.position - b.position;
        });
    }

    if (product.translated.customFields != null) {
        obj.customFields = product.translated.customFields;
    }

    if (product.customFields != null) {
        obj.extenstions = product.customFields;
    }

    obj.related_product_ids = {
        buybox: [],
        byorder: [],
    };

    obj.crossSellings = product.crossSellings;

    obj.status = {
        is_new_from_date: '',
        is_new_to_date: '',
    };

    obj.facets = {
        number_facets: [],
        string_facets: [],
        category_facets: [],
    };

    obj.properties = product.properties;
    obj.optionIds = product.optionIds;
    obj.options = product.options;
    obj.parentId = product.parentId;

    if (payload.configurator != null) {
        obj.groups = payload.configurator;
    }

    return obj;
}

function mappingCartProduct(product) {
    return {
        name_orig: product.label,
        id: product.id,
        referencedId: product.referencedId,
        qty: product.quantity,
        stock_item: {
            minPurchase: product.quantityInformation != null ? product.quantityInformation.minPurchase : null,
            maxPurchase: product.payload.isCloseout
                ? product.deliveryInformation.stock
                : product.quantityInformation != null
                ? product.quantityInformation.maxPurchase
                : null,
            purchaseSteps: product.quantityInformation != null ? product.quantityInformation.purchaseSteps : null,
            deliveryInformation: product.deliveryInformation,
        },
        final_price_item: {
            special_price: product.price.listPrice != null ? product.price.listPrice.price : null,
            display_price_brutto: product.price.unitPrice,
            tax: product.price.calculatedTaxes,
        },
        image: product.cover != null ? product.cover.url : null,
        thumbnails: product.cover != null ? product.cover.thumbnails : null,
        url_pds: product.payload.seoUrl != null ? product.payload.seoUrl : null,
        variants: product.payload.options.map((option) => {
            return {
                label: option.group,
                value_label: option.option,
            };
        }),
        type: product.type,
    };
}

function mappingCartPromotion(promotion) {
    return {
        name_orig: promotion.label,
        id: promotion.id,
        referencedId: promotion.referencedId,
        qty: promotion.quantity,
        final_price_item: {
            display_price_brutto: promotion.price.unitPrice,
            tax: promotion.price.calculatedTaxes,
        },
        type: promotion.type,
    };
}

function mappingMenu(menuItems) {
    return menuItems.map((menuItem) => {
        let obj = {};

        obj.name = menuItem.name;
        obj.level = menuItem.level;
        obj.id = menuItem.name;
        obj.request_path = menuItem.seoUrls[0].seoPathInfo;

        if (menuItem.children != null && menuItem.children.length > 0) {
            obj.children = mappingMenu(menuItem.children);
        }

        return obj;
    });
}

function mappingSearchSuggestProducts(products) {
    return products.map((product) => {
        let obj = {};

        obj.id = product.id;

        if (product.name) {
            obj.name = product.name;
        } else {
            obj.name = product.translated.name;
        }

        if (product.cover) {
            obj.image = product.cover.media;
        }

        obj.price = product.calculatedPrice.totalPrice;
        obj.url_pds = product.seoUrls[0].pathInfo;

        return obj;
    });
}

function mappingListingFilters(filters) {
    let obj = {};

    obj.navigationId = filters.navigationId;
    obj.manufacturer = filters.manufacturer;
    obj['min-price'] = '';
    if(filters.price.min !== 0) {
        obj['min-price'] = filters.price.min;
    }
    obj['max-price'] = '';
    if(filters.price.max !== 0) {
        obj['max-price'] = filters.price.max;
    }
    obj['shipping-free'] = filters['shipping-free'];
    obj.properties = filters.properties;

    return obj;
}

export {
    mappingCategory,
    mappingBreadcrumb,
    mappingCategoryProducts,
    mappingProduct,
    mappingCartProduct,
    mappingMenu,
    mappingCartPromotion,
    mappingSearchSuggestProducts,
    mappingListingFilters
};
