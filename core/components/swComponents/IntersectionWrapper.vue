<template>
    <div>
        <div
            v-if="count != null && count >= heroSectionNumbers"
            :id="cmsSlot._uniqueIdentifier"
            class="intersection-wrp"
            :class="{ loading: !showBlock }"
        >
            <lazy-block v-if="showBlock" :content="cmsSlot" :sizing-mode="sizingMode" />
        </div>
        <block v-else :content="cmsSlot" :sizing-mode="sizingMode" />
    </div>
</template>

<script>
export default {
    name: 'IntersectionWrapper',

    props: {
        cmsSlot: {
            type: Object,
            required: true,
        },
        count: {
            type: Number,
            required: false,
            default: null,
        },
        sizingMode: {
            type: Object,
            default: () => {}
        },
    },

    data() {
        return {
            showBlock: false,
            heroSectionNumbers: 2,
        };
    },

    mounted() {
        if (this.count != null && this.count >= this.heroSectionNumbers) {
            this.registerIntersectionObserver(`${this.cmsSlot._uniqueIdentifier}`);
        }
    },

    methods: {
        registerIntersectionObserver: function (targetSelector) {
            let options = {
                rootMargin: '20px',
                threshold: 0.01,
            };

            let observer = new IntersectionObserver(this.intersectionCallback, options);
            let target = document.getElementById(targetSelector);
            observer.observe(target);
        },
        intersectionCallback: function (entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.showBlock = true;
                    observer.disconnect();
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.intersection-wrp {
    width: 100%;
    min-height: 0;

    &.loading {
        min-height: 200px;
    }
}
</style>
