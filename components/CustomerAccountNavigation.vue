<template>
    <div class="link-wrp">
        <nuxt-link :to="localePath('customer-dashboard')" class="sidebar-link">
            <button class="button-secondary">
                {{$t('Customer Dashboard')}}
                <material-ripple></material-ripple>
            </button>
        </nuxt-link>
        <nuxt-link :to="localePath('customer-orders')" class="sidebar-link">
            <button class="button-secondary" >
                {{$t('My Orders')}}
                <material-ripple></material-ripple>
            </button>
        </nuxt-link>
        <nuxt-link :to="localePath('customer-addresses')" class="sidebar-link">
            <button class="button-secondary" >
                {{$t('Customer Addresses')}}
                <material-ripple></material-ripple>
            </button>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        name: "CustomerAccountNavigation"
    }
</script>
