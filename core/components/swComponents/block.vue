<template>
    <div class="cms-block" :class="[cssClass, blockClass, backgroundImageExists, sizingMode]" :style="backgroundStyles">
        <div class="cms-block-container">
            <div v-if="content.name" :class="{ container: sizingMode != null ? sizingMode['full-width'] : 'container' }">
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
            default: () => {},
        },
    },

    data() {
        return {
            component: null,
        };
    },

    computed: {
        cssClass() {
            return this.content.cssClass;
        },
        backgroundStyles() {
            const { backgroundColor, backgroundMedia, backgroundMediaMode } = this.content;

            return {
                backgroundColor,
                backgroundImage: backgroundMedia ? `url('${backgroundMedia.url}')` : null,
                backgroundSize: backgroundMediaMode ? backgroundMediaMode : null,
            };
        },
        backgroundImageExists() {
            const { backgroundMedia } = this.content;

            return backgroundMedia ? 'bg-image' : '';
        },
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
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/links';

/*
CMS blocks
==============================================
General styling for cms blocks and
specific styling for elements dependent on their parent block
*/

.cms-block {
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

    p a {
        @include text-link;
    }

    hr {
        margin: 10px 0;
    }

    &.full-width {
        .cms-row {
            margin: 0;
        }
    }
}

.cms-block-headline {
    margin-bottom: 20px;
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
}

/*
CMS elements
==============================================
General styling for cms elements
*/

.cms-element-product-listing-actions {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .sorting {
        margin-left: auto;
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
</style>
