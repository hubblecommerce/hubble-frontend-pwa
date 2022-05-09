<template>
    <div>
        <transition name="fade">
            <div v-if="text !== ''" class="flash-message-wrp" :class="type">
                <div class="message-text" v-text="text" />
            </div>
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'FlashMessage',

    computed: {
        ...mapState({
            text: (state) => state.modFlashMessage.text,
            type: (state) => state.modFlashMessage.type,
        }),
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.flash-message-wrp {
    position: relative;
    width: 100%;
    padding: 20px;
    line-height: 19px;
    background: $light-gray;

    &.success {
        color: $success-accent;
        background: lighten($success-accent, 50%);
    }

    &.error {
        color: $error-accent;
        background: lighten($error-accent, 50%);
    }

    &.info {
        color: $info-accent;
        background: lighten($info-accent, 50%);
    }

    &.warning {
        color: $warning-accent;
        background: lighten($warning-accent, 50%);
    }
}
</style>
