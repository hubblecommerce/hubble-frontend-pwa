<template>
    <div class="theme-setter"></div>
</template>

<script>
    export default {
        name: "TheThemeSetter",
        beforeMount() {
            this.setTheme();
        },
        methods: {
            setTheme: function() {
                this.$material.theming.theme = 'rocket';
            }
        }
    }
</script>