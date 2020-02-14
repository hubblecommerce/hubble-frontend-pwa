<template>
    <div v-click-outside="hideContent" class="collapse-wrp filter">
        <button :class="toggleClass" class="toggle m-0 align-left headline-4" @mousedown="collapseContent()">
            {{ toggleText }}

            <transition-rotate-x>
                <i v-if="collapse" :class="openIconClass" class="icon" />
            </transition-rotate-x>

            <transition-rotate-x>
                <i v-if="!collapse" :class="closeIconClass" class="icon" />
            </transition-rotate-x>

            <material-ripple />
        </button>
        <transition name="collapse-filter">
            <div v-if="!collapse" ref="collapseContent" class="collapse show collapse-item">
                <slot />
                <div v-if="applyButton" class="apply-filter-wrp">
                    <button class="button button-primary apply-filter" @click="hideContent">
                        <span v-text="$t('Apply')" />
                        <material-ripple />
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import TransitionRotateX from "../../transitions/TransitionRotateX";

    export default {
        name: "CollapsibleFilter",

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
            applyButton: {
                type: Boolean,
                default: true
            },
            maxHeight: {
                type: Number,
                default: 700
            }
        },

        data() {
            return {
                collapse: true
            };
        },

        methods: {
            collapseContent() {
                this.collapse = !this.collapse;
            },
            hideContent() {
                this.collapse = true;
            }
        },
    }
</script>
