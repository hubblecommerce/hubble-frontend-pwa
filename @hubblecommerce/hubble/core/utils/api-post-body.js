const associations = {
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

const includes = {
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
        "availableStock",
        "isCloseout",
        "minPurchase",
        "maxPurchase",
        "purchaseSteps",
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

const includesSearchSuggest = {
    "product_manufacturer": ["id", "name"],
    "product": ["id", "name", "calculatedPrice", "cover", "seoUrls"],
    "media": ["id", "url"],
    "product_media": ["media"],
    "calculated_price": ["unitPrice", "totalPrice"],
    "seo_url": ["pathInfo"]
}

export {associations, includes, includesSearchSuggest};
