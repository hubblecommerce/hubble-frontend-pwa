<template>
    <div class="loader" :class="`lds-${appearance}`">
        <div />
        <div />
        <div />
        <div />
    </div>
</template>

<script>
    export default {
        name: "Loader",

        props: {
            appearance: {
                type: String,
                required: false,
                default: 'ring'
            }
        }
    }
</script>
