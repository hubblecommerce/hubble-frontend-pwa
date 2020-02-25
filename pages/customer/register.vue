<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="register-wrp elevation-2">
                    <h2 class="title">{{ $t('Customer Registration') }}</h2>
                    <register-form />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomerRegistration',

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
