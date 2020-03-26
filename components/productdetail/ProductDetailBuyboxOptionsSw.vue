<template>
    <div>
        <div class="options-wrp">
            <div v-for="(group, index) in groups" class="option-wrp" :key="index" :class="group.name">
                <div class="option-label option-label-top" v-text="group.name" />

                <div class="option-val-wrp">
                    <div v-for="(option, optionIndex) in group.options" :key="optionIndex" class="option-val is-link">
                        <div v-text="option.name" />
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ProductDetailBuyboxOptionsSw",

        data() {
            return {
                itemLoaded: {},
            }
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiResources.dataProduct
            }),
            groups() {
                let groups = null;

                if(!_.isEmpty(this.itemLoaded.groups)) {
                    groups = this.itemLoaded.groups;
                }

                return groups;
            },
        },

        created() {
            // use copy of loaded item based on vuex store
            this.itemLoaded = this.dataProduct.result.item;

            console.log(this.itemLoaded.groups);

        },

        methods: {

        }
    };
</script>
