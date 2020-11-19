<template>
    <div class="collapse-wrp">
        <button :class="toggleClass" class="toggle m-0 align-left headline-4" @click.prevent="collapseContent()">
            <i v-if="toggleIconClass" :class="toggleIconClass" />

            {{ toggleText }}

            <transition-rotate-x>
                <i v-if="!collapsed" class="icon icon-minus" />
            </transition-rotate-x>

            <transition-rotate-x>
                <i v-if="collapsed" class="icon icon-plus" />
            </transition-rotate-x>

            <material-ripple />
        </button>

        <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave">
            <div v-if="!collapsed" ref="collapseContent" class="collapse show collapse-item">
                <slot />
            </div>
        </transition>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TransitionRotateX from '../transitions/TransitionRotateX';

export default {
    name: 'Collapsible',

    components: { TransitionRotateX },

    data() {
        return {
            collapsed: true
        }
    },

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
        toggleIconClass: {
            type: String,
            default: '',
        },
        isCollapsed: {
            required: false,
            type: Boolean,
            default: true,
        },
    },

    methods: {
        collapseContent: function() {
            this.collapsed = !this.collapsed;
        },
        beforeEnter: function (el) {
            el.style.maxHeight = 0;
        },
        afterEnter: function (el) {
            el.style.maxHeight = '700px';
        },
        beforeLeave: function (el) {
            el.style.maxHeight = '0';
        },
    },
};
</script>
