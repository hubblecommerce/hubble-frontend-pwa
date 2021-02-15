<template>
    <div :class="elementClass">
        <div class="category-navigation-box">
<!--            <product-listing-sidebar-nav :path-ids="pathIds" :category-id="categoryId" />-->
        </div>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'CategoryNavigationSlot',

    mixins: [slotMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        }
    }
};
</script>
