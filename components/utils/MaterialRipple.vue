<template>
    <div
        class="material-ripple__component"
        :class="computedClasses"
        :style="computedStyles"
    />
</template>

<script>
    export default {
        name: 'MaterialRipple',
        props: {
            center: {
                type: Boolean,
                default: false
            },
            size: {
                type: Number,
                default: null
            }
        },
        data () {
            return {
                isAnimated: false,
                width: 0,
                height: 0,
                top: 0,
                left: 0
            }
        },
        computed: {
            computedClasses () {
                return {
                    'ripple--animation': this.isAnimated
                }
            },
            computedStyles () {
                return {
                    top: this.top + 'px',
                    left: this.left + 'px',
                    width: this.width + 'px',
                    height: this.height + 'px'
                }
            }
        },
        mounted () {
            // container is not reactive:
            this.container = this.$el.parentNode;

            if(this.container !== null) {
                // We support both click and touch events:
                this.container.addEventListener('click', this.handleClick)
                this.container.addEventListener('touch', this.handleClick)
            }
        },
        beforeDestroy () {
            this.container.removeEventListener('click', this.handleClick)
            this.container.removeEventListener('touch', this.handleClick)
        },
        methods: {
            handleClick (event) {
                if (this.isAnimated) {
                    // The DOM is not ready yet:
                    this.isAnimated = false
                    this.$nextTick(() => {
                        // But on the next tick it will be ready:
                        this.animate(event)
                    })
                } else {
                    this.animate(event)
                }
            },
            getDocumentOffset () {
                const offset = require('document-offset') // ssr-friendly
                return offset(this.container) // polyfill
            },
            animate (event) {
                const position = this.getDocumentOffset()
                const size = Math.max( // getting the bigger size
                    this.container.offsetWidth,
                    this.container.offsetHeight
                )
                let top
                let left
                let finalSize
                if (this.center) {
                    // Working in a centered mode: animate from the single point.
                    finalSize = this.size || size
                    top = left = (size / 2) - (finalSize / 2)
                } else {
                    // Working in a normal mode: animate from the clicked point.
                    // This method works for both click and touch events:
                    const inputX = (event.type === 'click')
                        ? event.pageX : event.originalEvent.touches[0].pageX
                    const inputY = (event.type === 'click')
                        ? event.pageY : event.originalEvent.touches[0].pageY
                    const center = size / 2
                    finalSize = size
                    top = inputY - position.top - center
                    left = inputX - position.left - center
                }
                this.setInnerStyles(
                    finalSize, top, left
                )
            },
            setInnerStyles (size, top, left) {
                // Mutating the inner state:
                this.isAnimated = true
                this.width = this.height = size
                this.top = top
                this.left = left
            }
        }
    }
</script>

<style lang="scss">
    .material-ripple__component {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        &.ripple--animation {
            animation: ripple 0.4s linear; // runs the animation on element.
        }
    }
    // Theme:
    .material-ripple__component {
        background: rgba(0, 0, 0, .4); //
    }
    // Animation:
    @keyframes ripple {
        from {
            opacity: .5;
        }
        to {
            opacity: 0;
            transform: scale(3);
        }
    }
</style>
