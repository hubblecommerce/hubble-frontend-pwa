<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="login-wrp elevation-2">
                    <h2 class="title">{{ $t('Customer Login') }}</h2>
                    <login-form/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomerLogin',

    middleware: [
        'authRedirect',
        'apiAuthenticate',
        'apiLocalization',
        'apiResourceMenu',
        'trackClickPath'
    ],

    layout: 'hubble'
}
</script>
