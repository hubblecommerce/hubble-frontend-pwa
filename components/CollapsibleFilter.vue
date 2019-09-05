<template>
    <div class="collapse-wrp filter" v-click-outside="hideContent">
        <button @mousedown="collapseContent()" v-bind:class="toggleClass" class="toggle m-0 align-left headline-4">
            {{toggleText}}

            <transition-rotate-x>
                <i v-if="collapse" v-bind:class="openIconClass" class="icon"></i>
            </transition-rotate-x>

            <transition-rotate-x>
                <i v-if="!collapse" v-bind:class="closeIconClass" class="icon"></i>
            </transition-rotate-x>

            <material-ripple></material-ripple>
        </button>
        <transition name="collapse-filter" @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
            <div ref="collapseContent" v-if="!collapse" class="collapse show collapse-item">
                <slot></slot>
                <div class="apply-filter-wrp">
                    <button class="button button-primary apply-filter" @click="hideContent">
                        <span v-text="$t('Apply')"></span>
                        <material-ripple/>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import TransitionRotateX from "./TransitionRotateX";

    export default {
        name: "CollapsibleFilter",
        components: {TransitionRotateX},
        data() {
            return {
                collapse: true
            };
        },
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
            }
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
                this.collapse = true;
            }
        },
    }
</script>
