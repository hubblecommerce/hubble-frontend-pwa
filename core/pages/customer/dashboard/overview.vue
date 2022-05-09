<template>
    <div class="col-sm-12 col-md-9 content-wrp">
        <div class="row">
            <div class="col-md-12">
                <div class="box account-info-wrp">
                    <div
                        class="box-title"
                        v-text="'Personal information'"
                    />

                    <div class="box-content">
                        <p
                            v-text="
                                `${customer.firstName} ${customer.lastName}`
                            "
                        />
                        <p v-text="customer.email" />
                    </div>

                    <nuxt-link
                        to="/customer/dashboard/data"
                        class="button button-primary"
                        >Edit data</nuxt-link
                    >
                </div>
            </div>
        </div>

        <customer-dashboard-addresses />
        <customer-order-list title="Recent orders" limit="4" />
    </div>
</template>
<script>
export default {
    name: "CustomerDashboardOverview",
    props: ["customer"],
};
</script>

<style lang="scss">
.change-password-link {
    text-decoration: underline;
}
</style>
