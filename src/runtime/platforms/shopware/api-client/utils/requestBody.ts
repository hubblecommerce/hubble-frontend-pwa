const includes = {
    cms_slot: ['_uniqueIdentifier', 'type', 'slot', 'blockId', 'config', 'data', 'backgroundMediaMode', 'backgroundMedia'],
    cms_block: ['slots', 'type', '_uniqueIdentifier', 'cssClass', 'name', 'backgroundColor', 'backgroundMedia', 'backgroundMediaMode', 'sectionPosition'],
    cms_section: ['_uniqueIdentifier', 'cssClass', 'backgroundMedia', 'backgroundMediaMode', 'blocks', 'type', 'sizingMode'],
    cms_page: ['_uniqueIdentifier', 'name', 'sections', 'type', 'config'],
    product: [
        'media',
        'productReviews',
        'children',
        'name',
        'ratingAverage',
        'calculatedPrice',
        'calculatedPrices',
        'calculatedListingPrice',
        'cover',
        'parentId',
        'id',
        'translated',
        'customFields',
        'options',
        'properties',
        'productNumber',
        'manufacturer',
        'seoUrls',
        'optionIds',
        'ean',
        'description',
        'stock',
        'availableStock',
        'isCloseout',
        'minPurchase',
        'maxPurchase',
        'purchaseSteps',
        'available',
        'deliveryTime',
        'shippingFree',
        'crossSellings',
        'childCount',
        'markAsTopseller',
        'isNew'
    ],
    product_media: ['media', 'customFields', 'position'],
    calculated_price: ['unitPrice', 'quantity', 'listPrice'],
    media: ['thumbnails', 'width', 'height', 'url'],
    product_group_option: ['name', 'id', 'group', 'translated'],
    product_group: ['id', 'name', 'options', 'translated'],
    product_listing: ['sorting', 'currentFilters', 'elements', 'page', 'limit', 'sortings', 'availableSortings', 'total', 'aggregations'],
    property_group: ['id', 'translated', 'options', 'filterable', 'name'],
    property_group_option: ['name', 'translated', 'id', 'colorHexCode', 'media', 'group'],
    category: ['active', 'id', 'name', 'description', 'metaTitle', 'metaDescription', 'keywords', 'breadcrumb', 'media', 'level', 'path', 'translated']
}

const associations = {
    media: {}
}

export { includes, associations }
