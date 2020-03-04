<template>
    <div class="col-12">
        <sidebar-filter-slot />
    </div>
</template>

<script>
    import SidebarFilterSlot from '../slots/sidebar-filter'

    export default {
        name: 'SidebarFilterBlock',
        components: { SidebarFilterSlot },
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
    }
</script>

<style scoped>

</style>
