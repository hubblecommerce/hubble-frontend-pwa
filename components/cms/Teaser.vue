<template>
    <div class="teaser-card-wrp">
        <template v-if="descriptionPosition === 'top'">
            <div class="teaser-description-container">
                <div class="teaser-description-wrp description-top">
                    <div class="teaser-box">
                        <div class="teaser-description">
                            <nuxt-link :to="redirectLink">
                                <div class="headline-4 description-headline" v-text="descriptionHeadline" />
                            </nuxt-link>
                            <nuxt-link :to="redirectLink">
                                <div v-if="$mq === 'md' || $mq === 'lg'" class="text-small teaser-description-text" v-text="description" />
                            </nuxt-link>
                            <nuxt-link :to="redirectLink" class="active-link text-small" v-text="$t(descriptionLinkText)" />
                        </div>
                    </div>
                    <div v-if="showArrows" class="arrow-down" />
                </div>
            </div>
            <nuxt-link :to="redirectLink">
                <picture>
                    <source :srcset="picturePathWebp" type="image/webp" />
                    <img class="teaser-picture teaser-picture-top" :src="picturePath" alt="'Teaser Image'" :title="descriptionHeadline" />
                </picture>
                <!-- <img-lazy :src="picturePath" :class="'teaser-picture teaser-picture-bottom'" :alt-info="'Teaser Image'" :title-info="descriptionHeadline" />-->
            </nuxt-link>
        </template>
        <template v-else>
            <nuxt-link :to="redirectLink">
                <picture>
                    <source :srcset="picturePathWebp" type="image/webp" />
                    <img class="teaser-picture teaser-picture-top" :src="picturePath" alt="'Teaser Image'" :title="descriptionHeadline" />
                </picture>
                <!--<img-lazy :src="picturePath" :class="'teaser-picture teaser-picture-top'" :alt-info="'Teaser Image'" :title-info="descriptionHeadline" />-->
            </nuxt-link>
            <div class="teaser-description-container">
                <div class="teaser-description-wrp description-bottom">
                    <div v-if="showArrows" class="arrow-up" />
                    <div class="teaser-box">
                        <div class="teaser-description">
                            <nuxt-link :to="redirectLink">
                                <div class="headline-4 description-headline" v-text="descriptionHeadline" />
                            </nuxt-link>
                            <nuxt-link :to="redirectLink">
                                <div v-if="$mq === 'md' || $mq === 'lg'" class="text-small teaser-description-text" v-text="description" />
                            </nuxt-link>
                            <nuxt-link :to="redirectLink" class="active-link text-small" v-text="$t(descriptionLinkText)" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Teaser',

    props: {
        type: {
            type: String,
            default: 'category',
        },
        picturePathWebp: {
            type: String,
            default: '',
        },
        picturePath: {
            type: String,
            required: true,
        },
        descriptionPosition: {
            type: String,
            default: 'top',
        },
        descriptionHeadline: {
            type: String,
            default: 'Teaser Headline',
        },
        description: {
            type: String,
            default: 'Teaser Description',
        },
        redirectLink: {
            type: String,
            default: '#',
        },
        showArrows: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        descriptionLinkText: function () {
            if (this.type === 'product') {
                return 'Buy now';
            }
            if (this.type === 'category') {
                return 'Discover now';
            }
            return 'Buy now';
        },
    },
};
</script>
