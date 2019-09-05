<template>
  <div>
    <div class="container" v-if="$mq === 'md' || $mq === 'lg'"></div>
    <div class="index-wrp-mobile" v-if="$mq === 'sm'"></div>
  </div>
</template>

<script>
  export default {
    layout: 'hubble',

    middleware: [
      'apiAuthenticate',
      'apiLocalization',
      'apiResourceMenu',
      'trackClickPath'
    ],

    head () {
        return {
            title: 'Hubble Demo',
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: 'Headless Hubble Nuxt App' },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
                { hid: 'keywords', name: 'keywords', content: 'hubble, nuxt, vue, frontend, performance' }
            ]
        }
    }
  }
</script>
