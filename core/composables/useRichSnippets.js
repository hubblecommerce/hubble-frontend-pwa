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
                'priceCurrency': 'EUR',
                'price': product.final_price_item.display_price_brutto,
                'itemCondition': 'https://schema.org/NewCondition',
                'availability': product.stock_item.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
        };
    };

    const getStructuredDataFAQ = function (faqs) {
        if (faqs === null) {
            return {};
        }

        let structuredFaqs = faqs.map((faq) => {
            return {
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer,
                },
            };
        });

        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': structuredFaqs,
        };
    };

    return {
        getStructuredDataProduct,
        getStructuredDataFAQ,
    };
}
