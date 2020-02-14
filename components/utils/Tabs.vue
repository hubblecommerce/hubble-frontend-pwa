<template>
    <div class="tabs-component">
        <div role="tablist" class="tabs-component-tabs">
            <div
                v-for="(tab, i) in tabs"
                :key="i"
                :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }"
                class="tabs-component-tab"
                role="presentation"
                v-show="tab.isVisible"
                ref="tabs"
            >
                <a v-html="tab.header"
                    @click="selectTab(tab.hash, $event)"
                    class="tabs-component-tab-a"
                    role="tab"
                ></a>
            </div>
            <div>
                <span class="active-bar" :style="{ width: activeWidth + 'px', left: activePosLeft + 'px' }"></span>
            </div>
        </div>
        <div class="tabs-component-panels">
            <slot/>
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
                    currentTab: null
                }),
            },
            defaultTab: {
                type: Number,
                required: false,
                default: null
            }
        },
        data: () => ({
            tabs: [],
            activeTabHash: '',
            activeTabIndex: 0,
            lastActiveTabHash: '',
            activeWidth: 0,
            activePosLeft: 0
        }),
        created() {
            this.tabs = this.$children;

            this.$on('changed', () => {
                this.$nextTick(() => {
                    this.setActivePosition();
                });
            })
        },
        mounted() {
            // If default tab is set, then set this tab as initial opened tab. Otherwise set first tab as initial tab
            if(this.tabs.length && this.defaultTab !== null) {
                this.currentTab = this.tabs[this.defaultTab].hash;
            } else {
                this.currentTab = this.tabs[0].hash;
            }

            this.selectTabInitial(this.currentTab);

            this.$nextTick(() => {
                this.setActivePosition();
            });
        },
        methods: {
            setActivePosition: function() {
                let tabs = this.$refs.tabs;

                if(tabs) {
                    tabs.forEach((element) => {
                        if (element.classList[1] == 'is-active') {
                            this.activeWidth = element.offsetWidth;
                            this.activePosLeft = element.offsetLeft;
                        }
                    });
                }
            },
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },
            selectTab(selectedTabHash, event) {

                // See if we should store the hash in the url fragment.
                if (event && !this.options.useUrlFragment) {
                    event.preventDefault();
                }
                const selectedTab = this.findTab(selectedTabHash);
                if (! selectedTab) {
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
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });
                this.$emit('changed', { tab: selectedTab });
                this.activeTabHash = selectedTab.hash;
                this.activeTabIndex = this.getTabIndex(selectedTabHash);
            },
            selectTabInitial(selectedTabHash, event) {
                // See if we should store the hash in the url fragment.
                if (event && !this.options.useUrlFragment) {
                    event.preventDefault();
                }
                const selectedTab = this.findTab(selectedTabHash);
                if (! selectedTab) {
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
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });
                //this.$emit('changed', { tab: selectedTab });
                this.activeTabHash = selectedTab.hash;
                this.activeTabIndex = this.getTabIndex(selectedTabHash);

                this.initialActive = false;
            },
            setTabVisible(hash, visible) {
                const tab = this.findTab(hash);
                if (! tab) {
                    return;
                }
                tab.isVisible = visible;
                if (tab.isActive) {
                    // If tab is active, set a different one as active.
                    tab.isActive = visible;
                    this.tabs.every((tab, index, array) => {
                        if (tab.isVisible) {
                            tab.isActive = true;
                            return false;
                        }
                        return true;
                    });
                }
            },

            getTabIndex(hash){
                const tab = this.findTab(hash);

                return this.tabs.indexOf(tab);
            },

            getTabHash(index){
                const tab = this.tabs.find(tab => this.tabs.indexOf(tab) === index);

                if (!tab) {
                    return;
                }

                return tab.hash;
            },

            getActiveTab(){
                return this.findTab(this.activeTabHash);
            },

            getActiveTabIndex() {
                return this.getTabIndex(this.activeTabHash);
            },

        },
    };
</script>
