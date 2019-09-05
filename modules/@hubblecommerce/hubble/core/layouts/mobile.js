import { mapState } from 'vuex';

export default {
    data() {
        return {
            vp: ''
        }
    },
    computed: {
        ...mapState({
            apiAuthResponse: state => state.modApiResources.apiAuthResponse,
            dataMenu: state => state.modApiResources.dataMenu,
            isHubble: state => state.modHubbleSwitch.isHubble
        }),
        menuItems() {
            return this.dataMenu.result.items;
        }
    }
}
