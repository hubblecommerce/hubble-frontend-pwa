<template>
    <div class="cms-block" :class="[blockClass, backgroundImageExists]" :style="backgroundStyles">
        <div class="cms-block-container">
            <div :class="{ container: sizingMode != null ?sizingMode['full-width'] : 'container'} ">
                <h2 v-if="content.name" class="cms-block-headline headline-1">{{ content.name }}</h2>
            </div>
            <component :is="component" :content="content" :sizing-mode="sizingMode" class="cms-block-container-row cms-row" />
        </div>
    </div>
</template>

<script>
import { sectionMixins } from './helper';
export default {
    name: 'Block',

    mixins: [sectionMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
        sizingMode: {
            type: Object,
            default: () => {}
        },
    },

    data() {
        return {
            component: null,
        };
    },

    created() {
        this.setComponentName();
    },

    methods: {
        setComponentName() {
            this.component = () =>
                import(`~/components/swComponents/blocks/${this.content.type}-block`).catch(() => {
                    return import('./NoComponent');
                });
        },
    },

    computed: {
        backgroundStyles() {
            const { backgroundColor, backgroundMedia, backgroundMediaMode } = this.content;

            return {
                backgroundColor,
                backgroundImage: backgroundMedia ? `url(${backgroundMedia.url})` : null,
                backgroundSize: backgroundMediaMode ? backgroundMediaMode : null,
            };
        },
        backgroundImageExists() {
            const { backgroundMedia } = this.content;

            return backgroundMedia ? 'bg-image' : '';
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

/*
CMS blocks
==============================================
General styling for cms blocks and
specific styling for elements dependent on their parent block
*/

.cms-block {
    overflow: hidden;
    margin-top: $cms-block-margin;

    &.bg-image {
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .cms-block-container {
        .cms-block-container-row {
            flex-direction: row;
        }
    }
}

.cms-block-center-text {
    .cms-element-text {
        padding: 30px;
    }
}

.cms-block-image-three-cover {
    .row {
        margin: 0;
    }

    [class^='col-'] {
        padding: 0;
    }
}

.cms-block-image-text-bubble,
.cms-block-image-bubble-row {
    .cms-element-image .cms-image-container {
        height: 300px;
        width: 300px;
        margin: auto;
        border-radius: 50%;
        background-clip: padding-box;
        overflow: hidden;
    }
}

.cms-block-image-highlight-row {
    .cms-element-image {
        border: 12px solid $border-color;
    }
}

.cms-block-image-text-bubble,
.cms-block-image-text-row {
    .cms-element-text {
        padding-top: 20px;
    }
}

.cms-block-image-text-gallery {
    .image-text-gallery-card {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
    }

    .cms-element-text {
        padding: 20px;
    }
}

.cms-block-text-on-image {
    .cms-element-text {
        padding: 30px;
        align-items: center;
        min-height: 240px;
    }
}

.cms-block-image-text-cover {
    .cms-element-text {
        padding-top: 30px;
    }
}

.cms-block-image-simple-grid {
    .left-top {
        margin-bottom: $grid-gutter-width;
    }

    .right {
        height: 100%;
    }
}

@media (min-width: 1024px) {
    .cms-block-container {
        .cms-block-container-row.has--sidebar {
            flex-direction: column;

            > div {
                flex-basis: 0;
                flex-grow: 1;
                max-width: 100%;
            }
        }
    }
}

@media (max-width: 768px) {
    .cms-block-image-text-gallery,
    .cms-block-image-two-column,
    .cms-block-image-three-column,
    .cms-block-image-four-column,
    .cms-block-image-bubble-row,
    .cms-block-image-highlight-row {
        .cms-row > :not(:last-child) {
            margin-bottom: $grid-gutter-width;
        }
    }

    .cms-block-image-text,
    .cms-block-image-text-cover {
        .cms-row > :first-child {
            margin-bottom: $grid-gutter-width;
        }
    }

    .cms-block-image-simple-grid {
        .left-bottom {
            margin-bottom: $grid-gutter-width;
        }
    }
}

.cms-block-sidebar-filter {
    overflow: visible;
}

/*
CMS elements
==============================================
General styling for cms elements
*/

.cms-element-image {
    position: relative;
    height: 100%;

    .cms-image {
        display: block;
        max-width: 100%;
        margin: 0 auto;
        width: 100%;
    }

    .cms-image-container {
        max-width: 100%;
        position: relative;
        display: flex;

        a {
            width: 100%;
        }

        &.is-cover {
            height: 100%;

            .cms-image {
                object-fit: cover;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
        }

        &.is-cover,
        &.is-stretch {
            .cms-image {
                width: 100%;
            }
        }

        &.is-standard {
            height: 100%;
            object-fit: cover;
        }
    }

    .cms-image-link {
        display: block;
    }
}

.cms-element-youtube-video {
    position: relative;
    width: 100%;

    &.is--streched {
        height: 100%;
    }

    &::before {
        display: block;
        content: '';
        width: 100%;
        padding-top: calc((9 / 16) * 100%);
    }

    &__video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 0 none;
    }
}

.cms-element-vimeo-video {
    position: relative;
    width: 100%;

    &::before {
        display: block;
        content: '';
        width: 100%;
        padding-top: 56.25%;
    }

    &__video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 0 none;
    }
}

.cms-element-product-listing-actions {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .sorting {
        margin-left: auto;
    }
}

.cms-element-product-box {
    width: 100%;
}

.cms-element-product-slider {
    .cms-element-title {
        //font-size: $font-size-lg;
        font-weight: bold;
        //color: $headings-color;
    }
}
.cms-block-image-text-bubble,
.cms-block-image-bubble-row {
    .cms-element-image {
        .LazyImage {
            object-fit: cover;
            height: 100%;
        }
    }
}

.cms-element-text,
.cms-element-image,
.cms-element-product-box,
.cms-element-product-slider,
.cms-element-image-slider,
.cms-element-image-gallery {
    &.has-vertical-alignment {
        display: flex;
        height: 100%;
    }
}

.cms-element-image-gallery {
    // hides magnifier overlay because zoom container is displayed over gallery
    .magnifier-overlay {
        display: none;
    }
}

@media (min-width: 768px) {
    .cms-block-image-two-column,
    .cms-block-image-three-column,
    .cms-block-image-four-column,
    .cms-block-image-highlight-row {
        .cms-element-image {
            .cms-image-container {
                &.is-cover {
                    height: auto;
                }
            }
        }
    }

    .cms-block-image-highlight-row {
        .cms-element-image {
            height: auto;
        }
    }
}

@media (min-width: 1024px) {
    .cms-block-image-two-column,
    .cms-block-image-three-column,
    .cms-block-image-four-column,
    .cms-block-image-highlight-row {
        .cms-element-image {
            .cms-image-container {
                &.is-cover {
                    height: 100%;
                }
            }
        }
    }

    .cms-block-image-highlight-row {
        .cms-element-image {
            height: 100%;
        }
    }
}
</style>
