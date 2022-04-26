<template>
    <div class="tabs-component">
        <div role="tablist" class="tabs-component-tabs">
            <div
                v-for="(tab, i) in tabs"
                v-show="tab.isVisible"
                :key="i"
                ref="tabs"
                :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }"
                class="tabs-component-tab"
                role="presentation"
            >
                <span
                    class="tabs-component-item"
                    role="tab"
                    @click="selectTab(tab.hash, $event)"
                    v-text="tab.header"
                />
            </div>

            <div>
                <span
                    class="active-bar"
                    :style="{ width: activeWidth + 'px', left: activePosLeft + 'px' }"
                />
            </div>
        </div>

        <div class="tabs-component-panels">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Object,
            required: false,
            default: () => ({
                useUrlFragment: true,
                currentTab: null,
            }),
        },
        defaultTab: {
            type: Number,
            required: false,
            default: null,
        },
    },

    data: () => ({
        tabs: [],
        activeTabHash: '',
        activeTabIndex: 0,
        lastActiveTabHash: '',
        activeWidth: 0,
        activePosLeft: 0,
    }),

    created() {
        this.tabs = this.$children;

        this.$on('changed', () => {
            this.$nextTick(() => {
                this.setActivePosition();
            });
        });
    },

    mounted() {
        // If default tab is set, then set this tab as initial opened tab. Otherwise set first tab as initial tab
        if (this.tabs.length && this.defaultTab !== null) {
            this.currentTab = this.tabs[this.defaultTab].hash;
        } else {
            this.currentTab = this.tabs[0].hash;
        }

        this.selectTab(this.currentTab);
    },

    methods: {
        setActivePosition: function () {
            let tabs = this.$refs.tabs;

            if (tabs) {
                tabs.forEach((element) => {
                    if (element.classList[1] == 'is-active') {
                        this.activeWidth = element.offsetWidth;
                        this.activePosLeft = element.offsetLeft;
                    }
                });
            }
        },
        findTab(hash) {
            return this.tabs.find((tab) => tab.hash === hash);
        },
        selectTab(selectedTabHash, event) {
            // See if we should store the hash in the url fragment.
            if (event && !this.options.useUrlFragment) {
                event.preventDefault();
            }
            const selectedTab = this.findTab(selectedTabHash);
            if (!selectedTab) {
                return;
            }
            if (selectedTab.isDisabled) {
                event.preventDefault();
                return;
            }
            if (this.lastActiveTabHash === selectedTab.hash) {
                this.$emit('clicked', { tab: selectedTab });
                return;
            }
            this.tabs.forEach((tab) => {
                tab.isActive = tab.hash === selectedTab.hash;
            });
            this.$emit('changed', { tab: selectedTab });
            this.activeTabHash = selectedTab.hash;
            this.activeTabIndex = this.getTabIndex(selectedTabHash);
        },
        getTabIndex(hash) {
            const tab = this.findTab(hash);

            return this.tabs.indexOf(tab);
        },
    },
};
</script>

<style lang="scss">
/*
<tabs>
    <tab name="First tab">
        This is the content of the first tab
    </tab>
    <tab name="Second tab">
        This is the content of the second tab
    </tab>
    <tab name="Disabled tab" :is-disabled="true">
        This content will be unavailable while :is-disabled prop set to true
    </tab>
    <tab id="oh-hi-mark" name="Custom fragment">
        The fragment that is appended to the url can be customized
    </tab>
    <tab prefix="<span class='glyphicon glyphicon-star'></span> "
        name="Prefix and suffix"
        suffix=" <span class='badge'>4</span>">
        A prefix and a suffix can be added
    </tab>
</tabs>
*/

@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

$tab-active-color: $secondary;

/* Material Tab Styling */
.tabs-component {
    width: 100%;

    .tabs-component-tabs {
        flex: 1;
        position: relative;
        list-style: none;
        padding: 0;
        display: flex;
        border-bottom: 1px solid $border-color;
        margin: 0;

        .tabs-component-tab {
            font-weight: $font-weight-bold;
            text-align: center;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 26px;
            width: 50%;

            span {
                color: $text-primary;
                width: 100%;
            }

            &.is-active {
                span {
                    color: $tab-active-color;
                }
            }

            &:after {
                display: none;
            }
        }

        .tabs-component-item {
            cursor: pointer;
            font-size: 14px;
        }
    }

    .active-bar {
        position: absolute;
        left: 0;
        bottom: 0;

        height: 2px;
        width: 50px;
        background-color: $tab-active-color;

        transition: all 0.2s ease-in-out;

        &.default {
            width: 100%;
        }
    }

    .tabs-component-panels {
        position: relative;

        .tabs-component-panel {
            position: relative;
            padding: 20px 0 10px;
        }
    }
}

/* Desktop */
@media (min-width: 768px) {
    .tabs-component {
        .tabs-component-tabs {
            .tabs-component-tab {
                width: auto;
                flex: none;
            }
        }
        .tabs-component-panels {
            max-height: none;
            overflow-y: visible;

            .tabs-component-panel {
                display: block;
                overflow: visible;

                .selected-filters-wrp {
                    margin-bottom: 0;
                }
            }
        }
    }
}

@media (min-width: 1024px) {
    .tabs-component {
        .tabs-component-panels {
            .tabs-component-panel {
                .tab-content {
                    font-size: 16px;
                    line-height: 26px;
                    margin-top: 30px;
                }
            }
        }
    }
}
</style>
