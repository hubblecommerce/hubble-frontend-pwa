<template>
    <div class="mega-menu-wrp" @mouseleave="hideChildren">
        <div class="level-0-wrp">
            <nuxt-link
                v-for="item in dataItems" :key="item.id"
                class="menu-item"
                :class="{ active: isActive === item.id }"
                :to="itemUrlPath(item)"
                @mouseenter.native="showChildren(item)"
                v-text="item.name"
            />
        </div>
        <transition name="slide-top-bottom">
            <div v-if="showMenu && activeCategory.children" :class="'fixed-container ' + activeCategory.url_path" @mouseleave="hideChildren">
                <div class="max-width-container">

                    <template>
                        <div class="children-wrp">
                            <div v-for="child in activeCategory.children" v-if="showChild(child)" :key="child.id" class="child-wrp">
                                <nuxt-link v-if="child.name" :to="itemUrlPath(child)" class="child-item" v-text="child.name" />
                                <nuxt-link v-for="subchild in child.children" v-if="showChild(subchild)" :key="subchild.id" class="subchild-item" :to="itemUrlPath(subchild)" v-text="subchild.name" />

                                <div v-for="item in child.menu_items" :key="item.id">
                                    <nuxt-link v-if="item.manufacturer_info_url" :to="'/'+item.manufacturer_info_url" class="subchild-item" v-text="item.manufacturer_name" />
                                </div>
                            </div>
                        </div>
                    </template>

                    <div v-if="activeCategory.image != null" class="category-teaser" :style="'background-image: url('+itemImgPath(activeCategory)+')'" />

                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: "TheMegaMenu",

        props: {
            dataItems: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                name: "TheMegaMenu",
                showMenu: false,
                isActive: null,
                activeCategory: {},
                limit: 12
            }
        },

        computed: {
            rootItem() {
                return {
                    name: 'root',
                    children: this.dataItems
                }
            },
            ...mapGetters([
                'modApiResources/getApiLocale'
            ])
        },

        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.showMenu = false;
            }
        },

        methods: {
            ...mapActions({
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
                showOffcanvasAction: 'modNavigation/showOffcanvasAction',
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                resetAutoCompleteResults: 'modSearch/resetAutoCompleteResults'
            }),
            toggle: function(){
                this.showMenu = !this.showMenu;
                this.toggleOffcanvasAction({component: this.name})
            },
            itemUrlPath(item) {
                let _locale =  this.getApiLocale;

                if(_locale !== 'de') {
                    return '/' + _locale + '/' + item.url_path;
                }

                return '/' + item.url_path;
            },
            showChildren: function(item) {
                // Blur background on hover over category with children
                if(this.activeCategory.children !== null) {
                    this.showMenu = true;
                    this.isActive = item.id;
                    this.activeCategory = item;

                    this.showOffcanvasAction({component: this.name});
                    this.resetAutoCompleteResults();
                } else {
                    this.hideOffcanvasAction();
                }
            },
            // Check if child should be displayed
            // always display if it is a manufacturer
            // else display if child is active
            showChild: function(child) {
                if(!('is_active' in child)) {
                    return true;
                }
                return child.is_active;
            },
            hideChildren: function() {
                this.hideOffcanvasAction();
                this.showMenu = false;
                this.isActive = null;
            },
            itemImgPath: function(item) {
                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = item.image;

                    return _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            image
                        ],
                        '/'
                    );
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/' + this.imgFilter + '/' + item.image;
            }
        }
    }
</script>
