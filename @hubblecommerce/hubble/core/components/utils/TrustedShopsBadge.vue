<template>
    <div />
</template>

<script>
export default {
    name: 'TrustedShopsBadge',

    data() {
        return {
            badge: '',
        };
    },

    created() {
        if (process.env.TRUSTED_SHOPS_ID !== '') {
            // Append Config Script to DOM
            var s = document.createElement('script');
            s.type = 'text/javascript';
            var code =
                "var _tsid = '" +
                process.env.TRUSTED_SHOPS_ID +
                "';\n" +
                '                _tsConfig = {\n' +
                "                    'yOffset': '0', /* offset from page bottom */\n" +
                "                    'variant': 'reviews', /* reviews, default, custom, custom_reviews */\n" +
                "                    'customElementId': '', /* required for variants custom and custom_reviews */\n" +
                "                    'trustcardDirection': '', /* for custom variants: topRight, topLeft, bottomRight, bottomLeft */\n" +
                "                    'customBadgeWidth': '', /* for custom variants: 40 - 90 (in pixels) */\n" +
                "                    'customBadgeHeight': '', /* for custom variants: 40 - 90 (in pixels) */\n" +
                "                    'disableResponsive': 'false', /* deactivate responsive behaviour */\n" +
                "                    'disableTrustbadge': 'false', /* deactivate trustbadge */\n" +
                '                };';
            try {
                s.appendChild(document.createTextNode(code));
                document.body.appendChild(s);
            } catch (e) {
                s.text = code;
                document.body.appendChild(s);
            }

            // Load Trusted Shops Script and append to DOM
            var _ts = document.createElement('script');
            _ts.type = 'text/javascript';
            _ts.charset = 'utf-8';
            _ts.async = true;
            _ts.src = 'https://widgets.trustedshops.com/js/' + _tsid + '.js';
            var __ts = document.getElementsByTagName('script')[0];
            __ts.parentNode.insertBefore(_ts, __ts);
        }
    },
};
</script>
