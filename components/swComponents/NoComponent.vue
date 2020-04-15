<template>
    <div>
        <span>
            <b>
                {{ elementType }}<i> {{ getBlockType }} </i>
            </b>
            is not implemented yet!
        </span>
    </div>
</template>

<script>
export default {
    name: 'NoComponent',
    props: {
        content: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {};
    },
    computed: {
        elementType() {
            return this.content.slot ? `Slot` : `Block`;
        },
        getBlockType() {
            return this.content ? this.content.type : '';
        },
    },
};
</script>

<style scoped></style>
