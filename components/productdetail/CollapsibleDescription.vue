<template>
    <div class="collapse-wrp">
        <button :class="toggleClass" class="toggle m-0 align-left headline-4" @click.prevent="collapseContent()">
            <i v-if="toggleIconClass" :class="toggleIconClass" />
            {{ toggleText }}

            <transition-rotate-x>
                <i v-if="!collapsedState" class="icon icon-minus" />
            </transition-rotate-x>

            <transition-rotate-x>
                <i v-if="collapsedState" class="icon icon-plus" />
            </transition-rotate-x>

            <material-ripple />
        </button>
        <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
            <div v-if="!collapsedState" ref="collapseContent" class="collapse show collapse-item">
                <slot />
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import TransitionRotateX from "../transitions/TransitionRotateX";

    export default {
        name: "Collapsible",
        components: {TransitionRotateX},
        computed: {
            ...mapState({
                collapsedState: state => state.modCollapsibleState.collapsed
            })
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
            toggleIconClass: {
                type: String,
                default: ''
            },
            isCollapsed: {
                required: false,
                type: Boolean,
                default: true
            }
        },
        methods: {
            beforeEnter(el) {
                el.style.maxHeight = 0;
            },
            afterEnter(el) {
                el.style.maxHeight = '700px';
            },
            beforeLeave(el) {
                el.style.maxHeight = '0';
            },
            collapseContent() {
                this.$store.commit('modCollapsibleState/collapseContent');
            },
        }
    }
</script>
