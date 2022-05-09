<template>
    <div class="loader-wrp">
        <div class="loader" :class="`lds-${appearance}`">
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loader',

    props: {
        appearance: {
            type: String,
            required: false,
            default: 'ring',
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

/* Loading Dots */
.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
    
    div {
        position: absolute;
        top: 27px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: $primary;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);

        &:nth-child(1) {
            left: 6px;
            animation: lds-ellipsis1 0.6s infinite;
        }
        &:nth-child(2) {
            left: 6px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        &:nth-child(3) {
            left: 26px;
            animation: lds-ellipsis2 0.6s infinite;
        }
        &:nth-child(4) {
            left: 45px;
            animation: lds-ellipsis3 0.6s infinite;
        }
    }
}
@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(19px, 0);
    }
}

/* Loading Ring */
.lds-ring {
    display: inline-block;
    width: 20px;
    height: 30px;

    div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        margin: 5px 0;
        border: 2px solid $primary;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: $primary transparent transparent transparent;

        &:nth-child(1) {
            animation-delay: -0.45s;
        }
        &:nth-child(2) {
            animation-delay: -0.3s;
        }
        &:nth-child(3) {
            animation-delay: -0.15s;
        }
    }
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
