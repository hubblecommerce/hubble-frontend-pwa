<template>
    <div class="address-wrp">
        <div>
            <span v-text="getSalutationById(address.salutationId)" />
            <span v-text="address.firstName" />
            <span v-text="address.lastName" />
        </div>
        <div>
            <span v-text="address.street" />
        </div>
        <div>
            <span v-text="address.zipcode" />
            <span v-text="address.city" />
        </div>
        <div>
            <span v-text="getCountryById(address.countryId)" />
        </div>
        <hbl-button
            class="button edit-address button-primary"
            @click.native="updateAddress()"
            v-text="editButtonText"
        />
    </div>
</template>

<script>
export default {
    name: "AddressBox",
    props: [
        "address",
        "salutations",
        "countries",
        "updateAddressParent",
        "type",
    ],

    methods: {
        getSalutationById: function (id) {
            let selectFieldName = null;
            this.salutations.forEach((field) => {
                if (field.id === id) {
                    selectFieldName = field.translated.displayName;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        },
        getCountryById: function (id) {
            let selectFieldName = null;
            this.countries.forEach((field) => {
                if (field.id === id) {
                    selectFieldName = field.translated.name;
                    return selectFieldName;
                }
            });
            return selectFieldName;
        },
        updateAddress() {
            this.updateAddressParent(this.address, this.type);
        },
    },
    computed: {
        editButtonText() {
            if (this.type == "billing") {
                return "Edit billig address";
            }
            return "Edit shipping address";
        },
    },
};
</script>

<style lang="scss">
.edit-address {
    margin-top: 0.5rem;
}
</style>
