<template>
    <div v-click-outside="hideContent" class="collapse-wrp">
        <button class="toggle m-0 align-left headline-4" :class="toggleClasses" @mousedown.prevent="collapseContent()">
            {{ toggleText }}

            <!--            <transition-rotate-x>-->
            <!-- <i v-if="!collapse" :class="openIconClass" class="icon" /> -->
            <!--            </transition-rotate-x>-->

            <!--            <transition-rotate-x>-->
            <!-- <i v-if="collapse" :class="closeIconClass" class="icon" /> -->
            <!--            </transition-rotate-x>-->
        </button>

        <template v-if="displayViaIf">
            <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
                <div v-if="!collapse" ref="collapseContent" class="collapse show collapse-item">
                    <slot />
                </div>
            </transition>
        </template>

        <template v-else>
            <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
                <div v-show="collapse" ref="collapseContent" class="collapse show collapse-item">
                    <slot />
                </div>
            </transition>
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import vClickOutside from 'v-click-outside';

export default {
    name: 'Collapsible',

    props: {
        toggleTag: {
            type: [String, Array],
            default: () => ['button'],
        },
        toggleText: {
            type: String,
            default: '',
        },
        toggleClass: {
            type: String,
            default: '',
        },
        closeIconClass: {
            type: String,
            default: 'icon-chevron-up',
        },
        openIconClass: {
            type: String,
            default: 'icon-chevron-down',
        },
        maxHeight: {
            type: Number,
            default: 700,
        },
        displayViaIf: {
            type: Boolean,
            required: false,
        },
    },

    data() {
        return {
            collapse: false,
        };
    },

    computed: {
        toggleClasses: function () {
            let classes = '';

            if (this.collapse) {
                classes = 'active';
            }

            classes += this.toggleClass;

            return classes;
        },
    },

    created() {
        Vue.use(vClickOutside);
    },

    methods: {
        beforeEnter: function (el) {
            el.style.maxHeight = 0;
        },
        afterEnter: function (el) {
            el.style.maxHeight = el.scrollHeight + 'px';
        },
        beforeLeave: function (el) {
            el.style.maxHeight = '0';
        },
        collapseContent: function () {
            this.collapse = !this.collapse;
        },
        hideContent: function () {
            this.collapse = false;
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.collapse-wrp {
    width: 100%;

    button {
        width: 100%;
        display: flex;
        text-align: center;
        text-transform: none;

        &.align-left {
            justify-content: flex-start;
            align-items: center;
            padding-right: 50px;
        }

        &.active {
            &::after {
                transform: translate3d(0, -50%, 0) rotate(90deg);
            }
        }

        &::after {
            content: "";
            background-image: url("data:image/svg+xml,%3Csvg height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m3.29289322 6.29289322c.36048396-.36048396.92771502-.3882135 1.32000622-.08318861l.09420734.08318861 5.29289322 5.29210678 5.2928932-5.29210678c.360484-.36048396.927715-.3882135 1.3200062-.08318861l.0942074.08318861c.3604839.36048396.3882135.92771502.0831886 1.32000622l-.0831886.09420734-6 6.00000002c-.360484.3604839-.92771504.3882135-1.32000624.0831886l-.09420734-.0831886-6-6.00000002c-.39052429-.39052429-.39052429-1.02368927 0-1.41421356z' fill='%23000000' fill-rule='nonzero' transform='matrix(0 -1 1 0 0 20)'/%3E%3C/g%3E%3C/svg%3E%0A");
            background-repeat: no-repeat;
            background-position: center center;
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 16px;
            text-align: center;
            position: absolute;
            right: $base-padding;
            top: 50%;
            transform: translate3d(0, -50%, 0);
            transition: transform .2s;
        }
    }

    .icon {
        position: absolute;
        right: 20px;
    }

    .collapse-item {
        overflow: hidden;
        transition: max-height 0.3s;
        display: flex;
        flex-direction: column;

        button {
            justify-content: center;
        }

        > * {
            padding: 15px;
        }
    }
}
</style>
