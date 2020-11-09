<template>
    <div class="search-trigger-wrp">
        <div class="hbl-input-group">
            <input
                id="search-trigger"
                placeholder=" "
                type="text"
                value=""
                @click.prevent="onClick"
            />
            <label for="search-trigger">{{ $t('Search') }}</label>
            <i  class="icon icon-search" />
        </div>
    </div>
</template>

<script>
import {mapActions, mapMutations} from "vuex";

export default {
    name: "SearchTrigger",
    data() {
        return {
        }
    },
    methods: {
        ...mapMutations({
            hideOffcanvas: 'modNavigation/hideOffcanvas'
        }),
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
        }),
        onClick: function () {
            this.hideOffcanvas();
            this.toggle();
        },
        toggle: function () {
            this.toggleOffcanvasAction({
                component: 'TheSearchContext',
                direction: 'rightLeft'
            });
        }
    }
}
</script>
