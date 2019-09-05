<template>
    <div class="mega-menu-wrp" @mouseleave="hideChildren">
        <div class="level-0-wrp">
            <nuxt-link
                class="menu-item"
                v-bind:class="{ active: isActive === item.id }"
                v-for="item in dataItems" :key="item.id"
                :to="itemUrlPath(item)"
                @mouseenter.native="showChildren(item)"
                v-text="item.name" />
        </div>
        <transition name="slide-top-bottom">
            <div class="fixed-container" v-if="showMenu && activeCategory.children.length > 0" @mouseleave="hideChildren">
                <div class="max-width-container">
                    <div class="children-wrp">
                        <div class="child-wrp" v-for="child in activeCategory.children" :key="child.id">
                            <nuxt-link :to="itemUrlPath(child)" v-text="child.name" class="child-item" />
                            <nuxt-link class="subchild-item" v-for="subchild in child.children" :key="subchild.id" :to="itemUrlPath(subchild)" v-text="subchild.name" />
                            <nuxt-link v-if="child.manufacturer_info_url" :to="child.manufacturer_info_url" v-text="child.manufacturer_name" class="child-item" />
                        </div>
                    </div>
                    <div v-if="activeCategory.image != null" class="category-teaser" :style="'background-image: url('+itemImgPath(activeCategory)+')'"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "TheMegaMenu",

        data() {
            return {
                name: "TheMegaMenu",
                showMenu: false,
                isActive: null,
                activeCategory: {}
            }
        },

        props: {
            dataItems: {
                type: Array,
                required: true
            }
        },

        computed: {
            rootItem() {
                return {
                    name: 'root',
                    children: this.dataItems
                }
            }
        },

        created() {

        },

        methods: {
            toggle: function(){
                this.showMenu = !this.showMenu;
                this.$store.dispatch('modNavigation/toggleOffcanvasAction', {component: this.name});
            },
            itemUrlPath(item) {
                let _locale = this.$store.getters['modApiResources/getApiLocale'];

                if(_locale !== 'de') {
                    return '/' + _locale + '/' + item.url_path;
                }

                return '/' + item.url_path;
            },
            showChildren: function(item) {
                this.showMenu = true;
                this.isActive = item.id;
                this.activeCategory = item;

                // Blur background on hover over category with children
                if(this.activeCategory.children.length > 0) {
                    this.$store.dispatch('modNavigation/showOffcanvasAction', {component: this.name});
                } else {
                    this.$store.dispatch('modNavigation/hideOffcanvasAction');
                }
            },
            hideChildren: function() {
                this.$store.dispatch('modNavigation/hideOffcanvasAction');
                this.showMenu = false;
                this.isActive = null;
            },
            itemImgPath: function(item) {
                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = item.image;
                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'uploads/gisy/categories',
                            //'media/catalog/product',
                            //_letters[0],
                            //_letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/' + this.imgFilter + '/' + item.image;
            },
        },
        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.showMenu = false;
            }
        },
    }
</script>
