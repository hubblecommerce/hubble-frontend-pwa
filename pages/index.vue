<template>
    <div class="index-container">
        <g-t-m-data-layer
            event="homepageLoaded"
            page-type="home"
            page-title="Hubble demo"
            :breadcrumbs="[{'0': 'home'}]"
        />
        <div class="container">
            <div class="index-text-wrp">
                <div class="intro-text" style="max-width: 740px; margin: 0 auto; display: block;">
                    <h1 class="text-center intro-headline">Next Generation Shop Frontend</h1>
                    <h2 class="text-center">We deliver high Performance. High Conversion Rates. Consistent and fast Innovation.</h2>
                    <div class="text mb-4 text-center">
                        hubble is a frontend-layer boosting legacy eCommerce plattforms.
                        We embrace grown software, preserve existing business processes and deliver a Progressive Web App (PWA) in less than 90 days.
                        Expcect a super high performance, dedicated focus on mobile commerce and extremly fast development cycles.
                        Invest in the technology of tomorrow and scale that effect!
                    </div>
                    <h2 class="text-center">Any Device</h2>
                    <div class="text mb-4 text-center">
                        With a clear focus on mobile user experience, the hubble shop frontend is reliably supported on all modern devices.
                        Automatically gain full advantages on desktop viewports as well.
                        Address your target groups optimally across devices to expand them in the future.</div>
                    <h2 class="text-center">Any Shop Platform</h2>
                    <div class="text text-center">
                        A quick integration into your existing IT infrastructure while keeping existing business processes make hubble a real game changer.
                        Benefit from the advantages of great user experience and additional individual features.
                        No extra cost for expensive app development.</div>
                    <div class="text text-center">
                        Gain new agility and flexibility, enabling positive customer experiences and more conversions.
                    </div>
                </div>
            </div>
            <div v-view.once="onceHandler">
                <div class="new-products-wrp">
                    <div class="new-products-header">
                        <h2 class="headline headline-3 new-products-headline">New Products</h2>
                    </div>
                    <div class="product-carousel">
                        <product-listing v-if="newProducts.length > 0 && inView"
                                         :data-items="newProducts"
                                         :responsive="slider.options.responsive"
                                         :loop="false"
                                         :is-slider="true"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from "vuex";
    import GTMDataLayer from "../components/utils/GTMDataLayer";
    import {mapState} from "vuex";

    export default {
        name: "Index",

        components: {
            ProductListing: () => import('../components/productlist/ProductListing'),
            GTMDataLayer
        },

        layout: 'hubble',

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        data() {
            return {
                newProducts: [],
                inView: false,
                slider: {
                    options: {
                        responsive: {
                            0: {
                                items: 2,
                                mouseDrag: true,
                                controls: true
                            },
                            500: {
                                items: 3,
                                mouseDrag: true,
                                controls: true
                            },
                            1000: {
                                items: 5,
                                controls: true,
                                mouseDrag: false
                            }
                        }
                    }
                }
            }
        },

        computed: {
            ...mapState({
                dataMenu: state => state.modApiMenu.dataMenu
            })
        },

        methods: {
            ...mapActions({
                swGetCategoryProductsById: 'modApiCategory/swGetCategoryProductsById'
            }),
            onceHandler: function() {
                if(process.env.API_TYPE === 'sw') {
                    // Get id of first category that can be found
                    const categoryId = this.dataMenu.result.items[0].id;

                    this.swGetCategoryProductsById({id: categoryId}).then(response => {
                        this.newProducts = response.data.result.items;
                        this.inView = true;
                    });
                }
            }
        },

        head () {
            let structuredDataLogo = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": process.env.APP_BASE_URL,
                "logo": process.env.APP_BASE_URL + "/logo.png"
            };
            return {
                title: 'hubble Demo Store',
                meta: [
                    // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                    { hid: 'description', name: 'description', content: 'hubble Demo Store' },
                    { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
                    { hid: 'keywords', name: 'keywords', content: '' }
                ],
                script: [
                    { json: structuredDataLogo, type: 'application/ld+json' }
                ]
            }
        }
  }
</script>

<style lang="scss" scoped>
    .index-text-wrp {
        margin-top: 12px;
    }

    .intro-headline {
        font-size: 25px;
        line-height: 25px;
        margin: 30px 20px 30px !important;
    }

    @media(min-width: 768px) {
        .index-text-wrp {
            margin-top: 30px;
        }

        .intro-headline {
            font-size: 45px;
            line-height: 45px;
            margin: 40px !important;
        }
    }
</style>
