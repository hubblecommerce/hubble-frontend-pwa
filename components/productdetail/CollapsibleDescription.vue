<template>
    <div class="collapse-wrp">
        <button :class="toggleClass" class="toggle m-0 align-left headline-4" @click.prevent="collapseContent()">
            <i v-if="toggleIconClass" :class="toggleIconClass"></i>

            {{ toggleText }}

            <transition-rotate-x>
                <i v-if="!collapsedState" class="icon icon-minus"></i>
            </transition-rotate-x>

            <transition-rotate-x>
                <i v-if="collapsedState" class="icon icon-plus"></i>
            </transition-rotate-x>

            <material-ripple></material-ripple>
        </button>

        <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
            <div v-if="!collapsedState" ref="collapseContent" class="collapse show collapse-item">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
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

        computed: {
            ...mapState({
                collapsedState: state => state.modCollapsibleState.collapsed
            })
        },
        
        methods: {
            ...mapMutations({
                collapseContent: 'modCollapsibleState/collapseContent'
            }),
            beforeEnter: function(el) {
                el.style.maxHeight = 0;
            },
            afterEnter: function(el) {
                el.style.maxHeight = '700px';
            },
            beforeLeave: function(el) {
                el.style.maxHeight = '0';
            },
        }
    }
</script>
