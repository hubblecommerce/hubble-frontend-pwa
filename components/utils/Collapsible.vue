<template>
    <div v-click-outside="hideContent" class="collapse-wrp">
        <button :class="toggleClass" class="toggle m-0 align-left headline-4" @mousedown.prevent="collapseContent()">
            {{ toggleText }}

            <transition-rotate-x>
                <i v-if="!collapse" :class="openIconClass" class="icon" />
            </transition-rotate-x>

            <transition-rotate-x>
                <i v-if="collapse" :class="closeIconClass" class="icon" />
            </transition-rotate-x>

            <material-ripple />
        </button>

        <template v-if="displayViaIf">
            <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
                <div ref="collapseContent" v-if="collapse" class="collapse show collapse-item">
                    <slot />
                </div>
            </transition>
        </template>
        <template v-else>
            <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
                <div ref="collapseContent" v-show="collapse" class="collapse show collapse-item">
                    <slot />
                </div>
            </transition>
        </template>

    </div>
</template>

<script>
    import TransitionRotateX from "../transitions/TransitionRotateX";

    export default {
        name: "Collapsible",
        components: {TransitionRotateX},
        props: {
            toggleTag: {
                type: [String, Array],
                default: () => ['button']
            },
            toggleText: {
                type: String,
                default: ''
            },
            toggleClass: {
                type: String,
                default: ''
            },
            closeIconClass: {
                type: String,
                default: 'icon-minus'
            },
            openIconClass: {
                type: String,
                default: 'icon-plus'
            },
            maxHeight: {
                type: Number,
                default: 700
            },
            displayViaIf: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                collapse: false
            };
        },
        methods: {
            beforeEnter(el) {
                el.style.maxHeight = 0;
            },
            afterEnter(el) {
                el.style.maxHeight = this.maxHeight.toString()+'px';
            },
            beforeLeave(el) {
                el.style.maxHeight = '0';
            },
            collapseContent() {
                this.collapse = !this.collapse;
            },
            hideContent() {
                this.collapse = false;
            }
        },
    }
</script>
