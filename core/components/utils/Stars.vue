<template>
    <div class="stars">
        <div v-for="n in starCount" :key="n" class="star-wrp">
            <div
                class="star"
                :class="{
                    interactive,
                    'is-partial': states[n - 1].partial,
                    'is-partial-low': states[n - 1].partialLow,
                    'is-partial-high': states[n - 1].partialHigh,
                    'is-blank': states[n - 1].blank,
                }"
                @click="interactive && $emit('onClickStar', n)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                    <defs>
                        <path
                            id="icons-default-basic-shape-star-full-a"
                            d="M6.7998 23.3169c-1.0108.4454-2.1912-.0129-2.6367-1.0237a2 2 0 0 1-.1596-1.008l.5724-5.6537L.7896 11.394c-.736-.8237-.6648-2.088.1588-2.824a2 2 0 0 1 .9093-.4633l5.554-1.2027 2.86-4.9104c.556-.9545 1.7804-1.2776 2.7349-.7217a2 2 0 0 1 .7216.7217l2.86 4.9104 5.554 1.2027c1.0796.2338 1.7652 1.2984 1.5314 2.378a2 2 0 0 1-.4633.9093l-3.7863 4.2375.5724 5.6538c.1113 1.0989-.6894 2.08-1.7883 2.1912a2 2 0 0 1-1.008-.1596L12 21.0254l-5.2002 2.2915z"
                        ></path>
                    </defs>
                    <use fill="#758CA3" fill-rule="evenodd" xlink:href="#icons-default-basic-shape-star-full-a"></use>
                </svg>
            </div>
            <div v-if="states[n - 1].partial" class="star copy">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                    <defs>
                        <path
                            id="icons-default-basic-shape-star-full-a"
                            d="M6.7998 23.3169c-1.0108.4454-2.1912-.0129-2.6367-1.0237a2 2 0 0 1-.1596-1.008l.5724-5.6537L.7896 11.394c-.736-.8237-.6648-2.088.1588-2.824a2 2 0 0 1 .9093-.4633l5.554-1.2027 2.86-4.9104c.556-.9545 1.7804-1.2776 2.7349-.7217a2 2 0 0 1 .7216.7217l2.86 4.9104 5.554 1.2027c1.0796.2338 1.7652 1.2984 1.5314 2.378a2 2 0 0 1-.4633.9093l-3.7863 4.2375.5724 5.6538c.1113 1.0989-.6894 2.08-1.7883 2.1912a2 2 0 0 1-1.008-.1596L12 21.0254l-5.2002 2.2915z"
                        ></path>
                    </defs>
                    <use fill="#758CA3" fill-rule="evenodd" xlink:href="#icons-default-basic-shape-star-full-a"></use>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stars',

    props: {
        points: {
            type: Number,
            default: 0,
        },
        interactive: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            starCount: 5,
        };
    },

    computed: {
        states() {
            const states = [];

            for (let i = 1; i <= this.starCount; i++) {
                const partial = this.points % 1 > 0 && i - 1 === Math.floor(this.points);

                states.push({
                    partial: partial,
                    partialLow: partial && this.points % 1 < 0.5,
                    partialHigh: partial && this.points % 1 > 0.5,
                    blank: i > Math.ceil(this.points),
                });
            }

            return states;
        },
    },
};
</script>

<style lang="scss">
.stars {
    margin-right: 10px;

    .star-wrp {
        display: inline-block;
        position: relative;
    }

    .star {
        margin-right: 2px;
        color: #fedc70;

        &.interactive {
            cursor: pointer;
        }

        &.is-partial {
            clip-path: inset(0 50% 0 0);
            position: absolute;
            top: 0;
            left: 0;

            &.is-partial-low {
                clip-path: inset(0 75% 0 0);
            }

            &.is-partial-high {
                clip-path: inset(0 25% 0 0);
            }
        }

        &.is-blank,
        &.copy {
            color: #eee;
        }

        > svg path,
        > svg use {
            fill: currentColor;
        }
    }
}
</style>
