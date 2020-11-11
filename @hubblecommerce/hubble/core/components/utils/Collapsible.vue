<template>
    <div v-click-outside="hideContent" class="collapse-wrp">
        <button class="toggle m-0 align-left headline-4" :class="toggleClasses" @mousedown.prevent="collapseContent()">
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
                <div v-if="collapse" ref="collapseContent" class="collapse show collapse-item">
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
import TransitionRotateX from '../transitions/TransitionRotateX';
import Vue from 'vue';
import vClickOutside from 'v-click-outside';

export default {
    name: 'Collapsible',

    components: {
        TransitionRotateX,
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

    computed: {
        toggleClasses: function() {
            let classes = '';

            if(this.collapse) {
                classes = 'active';
            }

            classes += this.toggleClass;

            return classes;
        }
    },

    data() {
        return {
            collapse: false,
        };
    },

    created() {
        Vue.use(vClickOutside);
    },

    methods: {
        beforeEnter: function (el) {
            el.style.maxHeight = 0;
        },
        afterEnter: function (el) {
            el.style.maxHeight = this.maxHeight.toString() + 'px';
        },
        beforeLeave: function (el) {
            el.style.maxHeight = '0';
        },
        collapseContent: function () {
            this.collapse = !this.collapse;
        },
        hideContent: function () {
            this.collapse = false;
        }
    },
};
</script>
