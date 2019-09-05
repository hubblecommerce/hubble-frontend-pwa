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
    import DesktopCategories from "./DesktopCategories";

    export default {
        name: "TheDesktopMenu",

        components: {
            DesktopCategories
        },

        data() {
            return {
                showMenu: false,
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

        methods: {
            toggle: function(){
                this.showMenu = !this.showMenu
            }
        }
    }
</script>