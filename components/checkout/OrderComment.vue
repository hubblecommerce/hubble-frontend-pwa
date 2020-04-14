<template>
    <div class="order-comment-wrp">
        <div class="comment-title headline-3" v-text="$t('Comment')" />

        <div class="text-small subline" v-text="$t('Add your comments to this order here:')" />

        <div class="hbl-input-group">
            <textarea id="comment" v-model="orderComment" :placeholder="$t('Your comment')" />
            <label for="comment" v-text="$t('Comment')" />
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "OrderComment",

        data() {
            return {
                orderComment: ''
            }
        },

        computed: {
            ...mapGetters({
                getOrderComment: 'modApiPayment/getOrderComment'
            })
        },

        watch: {
            orderComment: function(newValue) {
                this.setOrderCommentMutation(newValue);
            }
        },

        mounted() {
            this.setOrderComment();
        },

        methods: {
            ...mapMutations({
                setOrderCommentMutation: 'modApiPayment/setOrderComment'
            }),
            setOrderComment: function() {
                if(this.getOrderComment) {
                    this.orderComment = this.getOrderComment;
                }
            }
        }
    }
</script>
