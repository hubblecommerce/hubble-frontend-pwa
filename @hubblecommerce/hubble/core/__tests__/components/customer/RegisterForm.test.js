import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import RegisterForm from '@hubblecommerce/hubble/core/components/customer/RegisterForm'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules.umd.js'
import veeValidate from '@hubblecommerce/hubble/core/plugins/vee-validate.js'
import { expectedErrorMessages, testDataArray, expectedRegisterData } from '../TestConfigs/RegisterFormConfig'

let wrapper
let store

let moduleB

jest.setTimeout(10000);
jest.useFakeTimers();

const $t = (msg) => msg

const flushPromises = () => new Promise(setImmediate)

async function flushAll() {
    await flushPromises();
    jest.runAllTimers();
    await flushPromises();
}

extend('required', required)

beforeEach( async (done) => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    const router = new VueRouter()

    localVue.component('ValidationObserver', ValidationObserver)
    localVue.component('ValidationProvider', ValidationProvider)

    const moduleA = {
        namespaced: true,
        state: {
            wishlistItemsObj: {},
            wishlistItemsCount: 5
        },
        mutations: {
            setWishlistId: jest.fn()
        },
        actions: {
            saveToStore: jest.fn()
        }
    }

    moduleB = {
        namespaced: true,
        state: {
            customer: {
                customerData: {
                    id: 1,
                }
            },
            availableCountries: [
                {
                    iso_code_2: 1,
                    name: 'testCountry1',
                },
                {
                    iso_code_2: 2,
                    name: 'testCountry2',
                },
                {
                    iso_code_2: 3,
                    name: 'testCountry3',
                },
            ]
        },
        actions: {
            register: jest.fn(),
            swGetSalutations: () => ({
                data: [
                    {
                        id: 'm',
                        displayName: 'Mr.'
                    },
                    {
                        id: 'f',
                        displayName: 'Mrs.'
                    },
                ]
            }),
            getAvailableCountries: () => ({
                get: Promise.resolve('value')
            }),
        }
    }

    store = new Vuex.Store({
        modules: {
            modWishlist: moduleA,
            modApiCustomer: moduleB,
        },
    })

    wrapper = mount(RegisterForm, {
        localVue,
        store,
        router,
        stubs: {
            NuxtLink: true,
            MaterialRipple: true,
        },
        mocks: {
            $t
          }
    })

    done()
})

test('test unfocus without input on all required fields', async () => {
    //expect before actions
    wrapper.findAll(' input[type=text][required] + label + .validation-msg').wrappers.forEach( (curr) => {
        expect(curr.text()).toBe('')
    })

    //test actions
    wrapper.findAll('input[required]').wrappers.forEach( async (curr) => {
        await curr.find('input').trigger('focus')
        await curr.find('input').trigger('blur')
    })

    await flushAll()

    //expected after actions
    wrapper.findAll(' input[required] + label + .validation-msg').wrappers.forEach( (curr, index) => {
        expect(curr.text()).toBe(expectedErrorMessages[index])
    })
})


describe('E-mail input tests', () => {
    test('test invalid e-mail inputs', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(0).text()).toBe('')
    
        //test actions
        await wrapper.find('#email').setValue('testFalseInput')
        await wrapper.find('#email').trigger('blur')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(0).text()).toBe('The email must be a valid email address.')
    })
})

describe('Password input tests', () => {
    test('test invalid password inputs', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(2).text()).toBe('')
        expect(wrapper.findAll('.validation-msg').at(3).text()).toBe('')
    
        //test actions
        await wrapper.find('#password').setValue('t')
        await wrapper.find('#password').trigger('blur')
        await wrapper.find('#passwordRepeat').setValue('t')
        await wrapper.find('#passwordRepeat').trigger('blur')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(2).text()).toBe('The password must be at least 8 characters long.')
        expect(wrapper.findAll('.validation-msg').at(3).text()).toBe('The password must be at least 8 characters long.')
    })

    test('test password and password repeat inequality', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(2).text()).toBe('')
        expect(wrapper.findAll('.validation-msg').at(3).text()).toBe('')
    
        //test actions
        await wrapper.find('#password').setValue('testPassword')
        await wrapper.find('#password').trigger('blur')
        await wrapper.find('#passwordRepeat').setValue('falsePassword')
        await wrapper.find('#passwordRepeat').trigger('blur')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(2).text()).toBe('')
        expect(wrapper.findAll('.validation-msg').at(3).text()).toBe('The password confirmation does not match.')
    })
})


describe('select option input validation with selection', () => {
    test('Salutation select option input validation without selection', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(5).text()).toBe('')
    
        //test actions
        await wrapper.findAll('.select-text').at(0).trigger('focus')
        await wrapper.findAll('.select-text').at(0).trigger('blur')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(4).text()).toBe('The gender is required.')
    })

    test('Salutation select option input validation with selection', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(4).text()).toBe('')
    
        //test actions
        await wrapper.findAll('.select-text').at(0).findAll('option').at(1).setSelected()
        await wrapper.findAll('.select-text').at(0).trigger('change')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(4).text()).toBe('')
    })

    test('Country select option input validation without selection', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(10).text()).toBe('')
    
        //test actions
        await wrapper.findAll('.select-text').at(1).trigger('focus')
        await wrapper.findAll('.select-text').at(1).trigger('blur')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(10).text()).toBe('The country is required.')
    })

    test('Country select option input validation with selection', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(10).text()).toBe('')
    
        //test actions
        await wrapper.findAll('.select-text').at(1).findAll('option').at(1).setSelected()
        await wrapper.findAll('.select-text').at(1).trigger('change')
        await flushAll()
    
        //expected after actions
        expect(wrapper.findAll('.validation-msg').at(10).text()).toBe('')
    })

})

describe('Test form submit', () => {
    test('submit empty form', async () => {
        //expect before actions
        expect(wrapper.findAll('.validation-msg').at(0).text()).toBe('')
    
        //test actions
        await wrapper.findAll('button').at(0).trigger('click')
        await wrapper.vm.$nextTick
        await flushAll()
    
        //expected after actions
        wrapper.findAll(' input[required] + label + .validation-msg').wrappers.forEach( (curr, index) => {
            expect(curr.text()).toBe(expectedErrorMessages[index])
        })
    })
    
    test('submit filled out form', async () => {
    
        testDataArray.forEach( (curr, index) => {
            wrapper.findAll('input[required]').at(index).setValue(curr)
        })
    
        await wrapper.findAll('.select-text').at(0).findAll('option').at(1).setSelected()
        await wrapper.findAll('.select-text').at(1).findAll('option').at(1).setSelected()
        await wrapper.find('#privacyPolicy').setChecked()
    
        await wrapper.findAll('button').at(0).trigger('click')
        await wrapper.vm.$nextTick
        await flushAll()
    
        //test if all actions have been called with correct values
        expect(moduleB.actions.register).toHaveBeenCalledWith(
            expect.any(Object),//vuex context
            expectedRegisterData
        )
    })

})
