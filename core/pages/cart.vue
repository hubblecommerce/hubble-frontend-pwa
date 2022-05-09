<template>
    <div class="cart-wrp container">
        <div class="row">
            <div class="col-12">
                <h1 v-text="'Cart'" />
            </div>
        </div>
        <cart-context />
    </div>
</template>

<script>
export default {
    name: 'Cart',

    head() {
        return {
            title: 'Cart',
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.cart-wrp {
    max-width: 650px;
    margin: 0 auto;
    .minicart-wrapper {
    }
}
</style>
