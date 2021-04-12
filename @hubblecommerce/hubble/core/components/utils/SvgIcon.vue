<template>
    <i :class="`icon icon-${icon}`" />
</template>

<script>
// Todo: create an editable svg icon component
// To load inline svg in nuxt: https://github.com/nuxt-community/svg-module
export default {
    name: 'SvgIcon',

    props: {
        icon: {
            type: String,
            default: 'placeholder',
        },
    },
};
</script>
