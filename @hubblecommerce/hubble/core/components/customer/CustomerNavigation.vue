<template>
    <div class="col-12 link-wrp">
        <nuxt-link :to="'/customer/dashboard'" class="sidebar-link">
            <hbl-button class="button-secondary">
                {{ 'Customer Dashboard' }}
            </hbl-button>
        </nuxt-link>

        <hbl-button class="button-primary logout-button" @click.native="logout">
            {{ 'Logout' }}
        </hbl-button>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import apiClient from '@/utils/api-client';

export default {
    name: 'CustomerNavigation',

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    methods: {
        ...mapMutations({
            resetContextToken: 'modSession/resetContextToken',
            resetCart: 'modCart/resetCart',
        }),
        logout: async function () {
            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/v3/account/logout',
                    contextToken: this.contextToken,
                });

                if (response.data.contextToken != null) {
                    this.resetContextToken();
                    this.resetCart();
                    this.$emit('logout-success');

                    if (this.$router.currentRoute.path.includes('/customer')) {
                        this.$router.push({ path: '/customer/login' });
                    }
                }
            } catch (e) {
                throw e;
            }
        },
    },
};
</script>

<style lang="scss">
.link-wrp {
    display: flex;
    flex-direction: column;
    justify-content: center;

    button {
        width: 100%;
        margin: 0 0 10px;
    }
}
</style>
