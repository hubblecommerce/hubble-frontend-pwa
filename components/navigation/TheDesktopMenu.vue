<template>
    <div class="menu-cpt-wrapper">
        <div class="menu-wrapper-desktop">
            <div class="tree-wrp">
                <desktop-categories :data-item="rootItem" :depth="0"></desktop-categories>
            </div>
        </div>
    </div>
</template>

<script>
    import DesktopCategories from "./navigation/DesktopCategories";

    export default {
        name: "TheDesktopMenu",

        components: {
            DesktopCategories
        },

        props: {
            dataItems: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                showMenu: false,
            }
        },

        computed: {
            rootItem: function() {
                return {
                    name: 'root',
                    children: this.dataItems
                }
            }
        },

        methods: {
            toggle: function() {
                this.showMenu = !this.showMenu
            }
        }
    }
</script>
