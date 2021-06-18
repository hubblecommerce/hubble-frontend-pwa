<template>
    <div class="container">
        <div class="cms-block-hero-banner__wrp">
            <div class="cms-block-hero-banner__content">
                <component :is="tagline" :content="getContentByPosition(content.slots, 'tagline')" />
                <component :is="headline" :content="getContentByPosition(content.slots, 'headline')" />
                <component :is="link" :content="getContentByPosition(content.slots, 'link')" />
            </div>
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'HeroBannerBlock',
    mixins: [blockMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        tagline() {
            return this.getSlotByPosition(this.content.slots, 'tagline');
        },
        headline() {
            return this.getSlotByPosition(this.content.slots, 'headline');
        },
        link() {
            return this.getSlotByPosition(this.content.slots, 'link');
        },
    },
};
</script>

<style lang="scss">
.cms-block-hero-banner {
    position: relative;
    
    &::after{
        content: '';
        position: absolute;
        bottom: 0;
        height: 50%;
        width: 100%;
        opacity: 0.3;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%);
        z-index: 0;
    }
    
    &__wrp {
        padding-top: 56.25%;
        position: relative;
    }

    &__content {
        position: absolute;
        width: 100%;
        z-index: 1;
        color: white;
        bottom: 60px;
    }

    .cms-element-headline__el {
        text-transform: uppercase;

        &.is--headline {
            font-weight: bold;
            margin: 15px 0 30px;
        }
    }
}
</style>
