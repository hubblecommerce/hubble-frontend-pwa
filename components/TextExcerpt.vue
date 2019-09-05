<template>
    <div class="text-excerpt">
        <div v-bind:class="{collapsed: isCollapsed}" class="text" v-html="truncatedText"></div>
        <div class="show-more" v-if="isCollapsed" v-text="$t('Show more')" @click="toggleCollapse()"></div>
    </div>
</template>

<script>
    export default {
        name: "TextExcerpt",
        data() {
            return {
                isCollapsed: true
            }
        },
        props: {
            text: {
                type: String,
                required: true
            },
            limit: {
                type: Number,
                required: true
            }
        },
        computed: {
            truncatedText: function() {
                if(this.isCollapsed) {
                    return this.truncateText(this.text);
                }
                return this.text;
            }
        },
        methods: {
            toggleCollapse: function() {
                this.isCollapsed = !this.isCollapsed;
            },
            truncateText: function(text) {
                let truncatedText;
                truncatedText = text.substring(0,this.limit);
                return truncatedText+"...";
            }
        },
    }
</script>
