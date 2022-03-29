export default function () {
    const getStructuredDataProduct = function (product, $config) {
        if (product === null) {
            return {};
        }

        return {
            '@context': 'http://schema.org',
            '@type': 'Product',
            'name': product.name,
            'image': product.image,
            'description': product.description,
            'sku': product.sku,
            'brand': {
                '@type': 'Thing',
                'name': product.manufacturer_name,
            },
            'mpn': product.sku,
            'offers': {
                '@type': 'Offer',
                'url': $config.appBaseUrl.trim() + '/' + product.url_pds,
                // 'priceCurrency': priceCurrency,
                'price': product.final_price_item.display_price_brutto,
                'itemCondition': 'https://schema.org/NewCondition',
                'availability': product.stock_item.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
            // More structured data...
        };
    };

    return {
        getStructuredDataProduct,
    };
}
