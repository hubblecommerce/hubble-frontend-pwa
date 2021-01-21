import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { state as apiStates ,actions as apiActions, mutations as apiMutations } from '@hubblecommerce/hubble/core/store/modApi'
import { state as customerState, actions as customerActions, mutations as customerMutations } from '@hubblecommerce/hubble/core/store/sw/modApiCustomer'
import { state as cartState, actions as cartActions, mutations as cartMutations, getters as cartGetters } from '@hubblecommerce/hubble/core/store/sw/modCart'
import { expectedCustomerData, expectedCustomerAdressData, expectedCartData, expectedCartItemsData } from '../TestConfigs/modApiCustomerTestConfig'
import { generateTestArray } from '../TestUtils/computeTestArrays'

let store
let mappedAddress
let mappedCutomerData
let mappedCartData
let mappedCartItemsData

let addressDataTests
let customerDataTests
let cartDataTests
let cartItemsDataTests

const addressDataTestsOld = [
    [
        'gender',
        'string'
    ],
    [
        'firstName',
        'string'
    ],
    [
        'lastName',
        'string'
    ],
    [
        'street',
        'string'
    ],
    [
        'houseNo',
        'string'
    ],
    [
        'postal',
        'string'
    ],
    [
        'city',
        'string'
    ],
    [
        'country',
        'string'
    ],
    [
        'company',
        'object'
    ]
]

const customerDataTestsOld = [
    [
        'name',
        'string',
    ],
    [
        'firstName',
        'string',
    ],
    [
        'lastName',
        'string',
    ],
    [
        'salutationId',
        'string',
    ],
    [
        'title',
        'string',
    ],
    [
        'birthDay',
        'string',
    ],
    [
        'email',
        'string',
    ],
    [
        'defaultBillingAddressId',
        'string',
    ],
    [
        'defaultShippingAddressId',
        'string',
    ]
]

const cartDataTestsOld = [
    [
        'items_qty',
        'number'
    ]
]

const cartItemsDataTestsOld = [
    [
        'name_orig',
        'string'
    ],
    [
        'id',
        'string'
    ],
    [
        'qty',
        'number'
    ],
    [
        'final_price_item',
        'object'
    ],
    [
        'image',
        'string',
    ],
    [
        'url_pds',
        'object'
    ],
    [
        'variants',
        'object'
    ]
]

jest.setTimeout(30000);

beforeAll( async (done) => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    addressDataTests = await generateTestArray(expectedCustomerAdressData)
    customerDataTests = await generateTestArray(expectedCustomerData)
    cartDataTests = await generateTestArray(expectedCartData)
    cartItemsDataTests = await generateTestArray(expectedCartItemsData)

    const moduleA = {
        state: apiStates,
        mutations: apiMutations,
        actions: apiActions
    }
    
    const moduleB = {
        state: customerState,
        mutations: customerMutations,
        actions: customerActions,
    }

    const moduleC = {
        namespaced: true,
        state: cartState,
        mutations: cartMutations,
        actions: cartActions,
        getters: cartGetters
    }

    const moduleD = {
        namespaced: true,
        mutations: {
            setChosenPaymentMethod: jest.fn(),
            setChosenShippingMethod: jest.fn()
        },
    }

    store = new Vuex.Store({
        modules: {
            modApi: moduleA,
            modApiCustomer: moduleB,
            modCart: moduleC,
            modApiPayment: moduleD
        },
    })

    store.$cookies = {
        remove: () => {
            return [{}]
        },
        set: () => {
            return [{}]
        }
    }

    store.$localForage = {
        setItem: () => {
            return [{}]
        }
    }

    await store.dispatch('logIn', { email: 'jane@doe.com', password: 'password'})
    await store.dispatch('getCustomerAddresses')

    mappedAddress = store.state.modApiCustomer.customer.customerAddresses[0].payload
    mappedCutomerData = store.state.modApiCustomer.customer.customerData
    mappedCartData = store.state.modCart.cart
    mappedCartItemsData = store.state.modCart.cart.items[0]

    // console.log(mappedCartData)

    done()
})

afterAll( async (done) => {
    await store.dispatch('logOut')
    done()
})

test('Test customer address data mapping', () => {
    addressDataTests.forEach( (testData) => {
        let errorMessage = 'Error in element: ' + testData[0]
        expect(mappedAddress[testData[0]], errorMessage).toBeDefined()
        expect(typeof mappedAddress[testData[0]], errorMessage).toBe(testData[1])
        expect(mappedAddress[testData[0]], errorMessage).toBe(testData[2])
    })
})

test('Test customer data mapping', () => {
    customerDataTests.forEach( (testData) => {
        let errorMessage = 'Error in element: ' + testData[0]
        expect(mappedCutomerData[testData[0]], errorMessage).toBeDefined()
        expect(typeof mappedCutomerData[testData[0]], errorMessage).toBe(testData[1])
        expect(mappedCutomerData[testData[0]], errorMessage).toBe(testData[2])
    })
})

describe('Cart test', () => {

    test('Test cart data mapping', () => {
        cartDataTests.forEach( (testData) => {
            let errorMessage = 'Error in element: ' + testData[0]
            expect(mappedCartData[testData[0]], errorMessage).toBeDefined()
            expect(typeof mappedCartData[testData[0]], errorMessage).toBe(testData[1])
            expect(mappedCartData[testData[0]], errorMessage).toBe(testData[2])
        })
    })

    test('Test cart items data mapping', () => {
        cartItemsDataTests.forEach( (testData) => {
            let errorMessage = 'Error in element: ' + testData[0]
            expect(mappedCartItemsData[testData[0]], errorMessage).toBeDefined()
            expect(typeof mappedCartItemsData[testData[0]], errorMessage).toBe(testData[1])
            expect(mappedCartItemsData[testData[0]], errorMessage).toBe(testData[2])
        })
    })

})