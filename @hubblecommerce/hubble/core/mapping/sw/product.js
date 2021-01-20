import {slugify} from '@hubblecommerce/hubble/core/utils/menuHelper';
import _ from 'lodash';

function productMapping (product, payload){
    let obj = {};

    obj.id = product.id;
    obj.sku = product.ean;
    obj.type = 'simple';
    if (product.optionIds !== null) {
        obj.type = 'configurable';
    }

    if (product.cover != null) {
        obj.image = product.cover.media.url;
    }

    obj.name_orig = product.translated.name;

    obj.name = product.translated.name;
    obj.description = product.translated.description;
    obj.meta_title = product.metaTitle;
    obj.meta_keywords = product.keywords;
    obj.meta_description = product.metaDescription;

    obj.stock_item = {
        qty: product.stock,
        is_in_stock: product.available,
    };

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

    obj.related_product_ids = {
        buybox: [],
        byorder: [],
    };

    obj.crossSellings = product.crossSellings;

    obj.shipping_free = product.shippingFree;

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

    if (!_.isEmpty(product.seoUrls)) {
        obj.url_pds = product.seoUrls[product.seoUrls.length - 1].seoPathInfo;
    }

    if (!_.isEmpty(product.calculatedPrices)) {
        obj.calculatedPrices = product.calculatedPrices;
    }

    if (product.calculatedPrices !== null | product.calculatedPrices.length != 0) {
        obj.calculatedPrices = product.calculatedPrices;
    }

    if (product.deliveryTime !== null) {
        obj.delivery_time = product.deliveryTime;
    }

    obj.media_gallery = [];
    if (product.media !== null) {
        _.each(product.media, (item) => {
            obj.media_gallery.push({
                attribute_id: null,
                value: item.media.url,
                label: item.media.alt,
                position: item.position,
                disabled: false,
            });
        });
    }

    // checks if payload exists because configurator only passed through modApiProduct-Mapping
    if(payload != null){
        if(payload.configurator != null) {
            obj.groups = payload.configurator;
        }
    }
    
    return obj;
}

export { productMapping };