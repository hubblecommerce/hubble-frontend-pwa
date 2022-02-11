<template>
    <div :class="elementClass">
        <PortalTarget name="filters"></PortalTarget>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'SidebarFilterSlot',
    mixins: [slotMixins],
    props: {
        content: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>
