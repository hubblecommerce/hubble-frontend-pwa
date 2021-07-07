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
    padding: 100px 0 25px;
    
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        height: 50%;
        width: 100%;
        opacity: 0.3;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%);
    }

    &__content {
        color: white;
    }

    .cms-element-headline__el {
        text-transform: uppercase;
        margin: 0;

        &.is--headline {
            margin-top: 5px;
            font-weight: bold;
            font-size: 32px;
            line-height: 40px;
        }
    }

    .button {
        margin-top: 30px;
        padding: 10px 25px 9px;
    }
}

@media (min-width: 768px) {
    .cms-block-hero-banner {
        padding: 0;

        &__wrp {
            position: relative;
            padding-top: 56.25%;
        }

        &__content {
            position: absolute;
            width: 75%;
            bottom: 60px;
        }

         .cms-element-headline__el {
            &.is--headline {
                font-size: 44px;
                line-height: 52px;
            }
        }
    }
}

@media (min-width: 1024px) {
    .cms-block-hero-banner {
        &__content {
            width: 50%;
        }

        .cms-element-headline__el {
            &.is--headline {
                font-size: 56px;
                line-height: 65px;
            }
        }
    }
}
</style>
