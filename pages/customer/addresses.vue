<template>
    <div class="main-container">
        <div class="container customer-dashboard customer-addresses">
            <div class="row">
                <div class="col-sm-12 col-md-3 sidebar-wrp" v-if="$mq === 'md' || $mq === 'lg'">
                    <customer-account-navigation></customer-account-navigation>
                </div>
                <div class="col-sm-12 col-md-9 content-wrp">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="title">{{ $t('Customer Addresses') }}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div v-for="(address, addressKey) in shippingAddresses" :key="addressKey" class="box md-elevation-2">
                                <div class="box-title">{{ $t('Shipping Address') }}</div>
                                <div v-if="editShippingMode !== addressKey" class="box-content">
                                    <p>{{address.firstName}} {{address.lastName}}</p>
                                    <p>{{address.street}} {{address.houseNo}}</p>
                                    <p>{{address.postcode}} {{address.city}}</p>
                                </div>
                                <div v-if="editShippingMode === addressKey">
                                    <div class="rct-input-group">
                                        <input type="text" name="s_firstname" value="" v-model="address.firstName" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('First Name')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_lastname" value="" v-model="address.lastName" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('Last Name')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_street" value="" v-model="address.street" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('Street')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_postcode" value="" v-model="address.postcode" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('Postcode')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_city" value="" v-model="address.city" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('City')"></label>
                                    </div>
                                </div>
                                <div class="box-utils">
                                    <button v-if="editShippingMode !== addressKey" @click="activateEditShippingMode(addressKey)" class="button-icon">
                                        <i class="icon rct-edit"></i>
                                        <div class="hidden-link-name">{{ $t('Edit Address') }}</div>
                                        <material-ripple></material-ripple>
                                    </button>
                                    <button v-if="editShippingMode === addressKey" @click="updateShippingAddress(addressKey)" class="rct-button-primary">
                                        {{ $t('Save Address') }}
                                        <material-ripple></material-ripple>
                                    </button>
                                    <button @click="removeShippingAddress(addressKey)" class="button-icon">
                                        <i class="icon rct-trash"></i>
                                        <div class="hidden-link-name">{{ $t('Remove Address') }}</div>
                                        <material-ripple></material-ripple>
                                    </button>
                                </div>
                            </div>
                            <div class="box add-address md-elevation-2">
                                <template v-if="formHasErrors">
                                    <span>form has errors</span>
                                    <pre>
                                        {{ formErrors }}
                                    </pre>
                                </template>

                                <div class="rct-input-group">
                                    <input type="text" name="s_firstname" value="" v-model="sFirstName" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('First Name')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_lastname" value="" v-model="sLastName" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('Last Name')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_street" value="" v-model="sStreet" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('Street')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_houseno" value="" v-model="sHouseNo" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('House no.')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_postcode" value="" v-model="sPostcode" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('Postcode')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_city" value="" v-model="sCity" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('City')"></label>
                                </div>

                                <button class="rct-button-primary w-100" @click="attemptAddShippingAddress">
                                    {{ $t('Add new Address') }}
                                    <material-ripple></material-ripple>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div v-for="(address, addressKey) in billingAddresses" :key="addressKey" class="box md-elevation-2">
                                <div class="box-title">{{ $t('Invoice Address') }}</div>
                                <div v-if="editBillingMode !== addressKey" class="box-content">
                                    <p>{{address.firstName}} {{address.lastName}}</p>
                                    <p>{{address.street}} {{address.houseNo}}</p>
                                    <p>{{address.postcode}} {{address.city}}</p>
                                </div>
                                <div v-if="editBillingMode === addressKey">
                                    <div class="rct-input-group">
                                        <input type="text" name="s_firstname" value="" v-model="address.firstName" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('First Name')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_lastname" value="" v-model="address.lastName" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('Last Name')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_street" value="" v-model="address.street" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('Street')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_houseno" value="" v-model="address.houseNo" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('House no.')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_postcode" value="" v-model="address.postcode" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('Postcode')"></label>
                                    </div>

                                    <div class="rct-input-group">
                                        <input type="text" name="s_city" value="" v-model="address.city" required>
                                        <span class="highlight"></span>
                                        <span class="bar"></span>
                                        <label v-text="$t('City')"></label>
                                    </div>
                                </div>
                                <div class="box-utils">
                                    <button v-if="editBillingMode !== addressKey" @click="activateEditBillingMode(addressKey)" class="button-icon">
                                        <i class="icon rct-edit"></i>
                                        <div class="hidden-link-name">{{ $t('Edit Address') }}</div>
                                        <material-ripple></material-ripple>
                                    </button>
                                    <button v-if="editBillingMode === addressKey" @click="updateBillingAddress(addressKey)" class="rct-button-primary">
                                        {{ $t('Save Address') }}
                                        <material-ripple></material-ripple>
                                    </button>
                                    <button @click="removeBillingAddress(addressKey)" class="button-icon">
                                        <i class="icon rct-trash"></i>
                                        <div class="hidden-link-name">{{ $t('Remove Address') }}</div>
                                        <material-ripple></material-ripple>
                                    </button>
                                </div>
                            </div>
                            <div class="box add-address md-elevation-2">
                                <template v-if="formHasErrors">
                                    <span>form has errors</span>
                                    <pre>
                                        {{ formErrors }}
                                    </pre>
                                </template>

                                <div class="rct-input-group">
                                    <input type="text" name="s_firstname" value="" v-model="bFirstName" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('First Name')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_lastname" value="" v-model="bLastName" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('Last Name')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_street" value="" v-model="bStreet" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('Street')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_houseno" value="" v-model="bHouseNo" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('House no.')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_postcode" value="" v-model="bPostcode" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('Postcode')"></label>
                                </div>

                                <div class="rct-input-group">
                                    <input type="text" name="s_city" value="" v-model="bCity" required>
                                    <span class="highlight"></span>
                                    <span class="bar"></span>
                                    <label v-text="$t('City')"></label>
                                </div>

                                <button class="rct-button-primary w-100" @click="attemptAddBillingAddress">
                                    {{ $t('Add new Address') }}
                                    <material-ripple></material-ripple>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CustomerAccountNavigation from "../../components/CustomerAccountNavigation";

    export default {
        name: 'CustomerDashboard',

        components: {CustomerAccountNavigation},

        layout: 'hubble',

        data() {
            return {
                curComponent: 'view-auth',

                formErrors: {},
                formHasErrors: false,

                sFirstName: '',
                sLastName: '',
                sStreet: '',
                sHouseNo: '',
                sPostcode: '',
                sCity: '',

                bFirstName: '',
                bLastName: '',
                bStreet: '',
                bHouseNo: '',
                bPostcode: '',
                bCity: '',

                editShippingMode: -1,
                editBillingMode: -1,
            }
        },

        computed: {
            ...mapState({
                authUser: state => state.modUser.authUser,
                shippingAddresses: state => state.modUser.authUser.customerShippingAddresses,
                billingAddresses: state => state.modUser.authUser.customerBillingAddresses,
            })
        },

        middleware: [
            'authRequired',
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        methods: {
            activateEditShippingMode: function(key) {
                this.editShippingMode = key;
            },
            activateEditBillingMode: function(key) {
                this.editBillingMode = key;
            },
            attemptAddShippingAddress() {
                this.$store.dispatch('modUser/addShippingAddress', {
                    firstName: this.sFirstName,
                    lastName: this.sLastName,
                    street: this.sStreet,
                    houseNo: this.sHouseNo,
                    postcode: this.sPostcode,
                    city: this.sCity
                })
                    .then(response => {
                        // console.log("attemptRegistration ... backend response success: %o", response);
                        this.sFirstName = '';
                        this.sLastName = '';
                        this.sStreet = '';
                        this.sHouseNo = '';
                        this.sPostcode = '';
                        this.sCity = '';
                    })
                    .catch(response => {
                        // console.log("attemptRegistration ... backend response failed: %o", response);
                        this.status = response;
                        this.hasStatus = true;
                    })
            },
            updateShippingAddress: function(key) {
                this.$store.dispatch('modUser/updateShippingAddress', {
                    addressId: key,
                    firstName: this.shippingAddresses[key].firstName,
                    lastName: this.shippingAddresses[key].lastName,
                    street: this.shippingAddresses[key].street,
                    houseNo: this.shippingAddresses[key].houseNo,
                    postcode: this.shippingAddresses[key].postcode,
                    city: this.shippingAddresses[key].city
                })
                    .then(response => {
                        // console.log("attemptRegistration ... backend response success: %o", response);
                    })
                    .catch(response => {
                        // console.log("attemptRegistration ... backend response failed: %o", response);
                        this.status = response;
                        this.hasStatus = true;
                    })

                // Deactivate edit mode
                this.editShippingMode = -1;
            },
            removeShippingAddress: function(key) {
                this.$store.dispatch('modUser/removeShippingAddress', {
                    addressId: key
                })
                    .then(response => {
                        // console.log("attemptRegistration ... backend response success: %o", response);
                    })
                    .catch(response => {
                        // console.log("attemptRegistration ... backend response failed: %o", response);
                        this.status = response;
                        this.hasStatus = true;
                    })
            },
            attemptAddBillingAddress() {
                this.$store.dispatch('modUser/addBillingAddress', {
                    firstName: this.bFirstName,
                    lastName: this.bLastName,
                    street: this.bStreet,
                    houseNo: this.bHouseNo,
                    postcode: this.bPostcode,
                    city: this.bCity
                })
                    .then(response => {
                        // console.log("attemptRegistration ... backend response success: %o", response);
                        this.bFirstName = '';
                        this.bLastName = '';
                        this.bStreet = '';
                        this.bHouseNo = '';
                        this.bPostcode = '';
                        this.bCity = '';
                    })
                    .catch(response => {
                        // console.log("attemptRegistration ... backend response failed: %o", response);
                        this.status = response;
                        this.hasStatus = true;
                    })
            },
            updateBillingAddress: function(key) {
                this.$store.dispatch('modUser/updateBillingAddress', {
                    addressId: key,
                    firstName: this.billingAddresses[key].firstName,
                    lastName: this.billingAddresses[key].lastName,
                    street: this.billingAddresses[key].street,
                    houseNo: this.billingAddresses[key].houseNo,
                    postcode: this.billingAddresses[key].postcode,
                    city: this.billingAddresses[key].city
                })
                    .then(response => {
                        // console.log("attemptRegistration ... backend response success: %o", response);
                    })
                    .catch(response => {
                        // console.log("attemptRegistration ... backend response failed: %o", response);
                        this.status = response;
                        this.hasStatus = true;
                    })

                // Deactivate edit mode
                this.editBillingMode = -1;
            },
            removeBillingAddress: function(key) {
                this.$store.dispatch('modUser/removeBillingAddress', {
                    addressId: key
                })
                    .then(response => {
                        // console.log("attemptRegistration ... backend response success: %o", response);
                    })
                    .catch(response => {
                        // console.log("attemptRegistration ... backend response failed: %o", response);
                        this.status = response;
                        this.hasStatus = true;
                    })
            }
        }
    }
</script>
