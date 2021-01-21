import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import PriceSlider from '@hubblecommerce/hubble/core/components/productlist/toolbar/PriceSlider'

let wrapper
let store

let testData = {
    initMinValue: 15,
    initMaxValue: 120,
    selectMinValue: 21,
    selectMaxValue: 83 
}

const $t = () => {}

beforeAll( async (done) => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    const moduleA = {
        namespaced: true,
        state: {
            priceCurrency: 'EUR',
            priceCurrencySymbol: '€'
        }
    }

    store = new Vuex.Store({
        modules: {
            modPrices: moduleA
        }
    })

    store.commit = jest.fn()
    store.dispatch = jest.fn()

    wrapper = mount(PriceSlider, {
        propsData: {
            dataMinValue: testData.initMinValue,
            dataMaxValue: testData.initMaxValue,
            dataMinSelected: testData.initMinValue,
            dataMaxSelected: testData.initMaxValue,
            filterOnChange: true,
        },
        localVue,
        store,
        mocks: {
            $t
        }
    })

    done()
})

test('Test correct display of data and vuex call with initial values', async () => {
    //expected before action
    expect(wrapper.vm.curMinLabel).toBe(testData.initMinValue)
    expect(wrapper.vm.curMaxLabel).toBe(testData.initMaxValue)

    //test action
    await wrapper.vm.onDragEnd()

    //expected after action
    expect(store.commit).toHaveBeenCalledWith(
        'modApiRequests/setSelectedPriceMin',
        testData.initMinValue
    )
    expect(store.commit).toHaveBeenCalledWith(
        'modApiRequests/setSelectedPriceMax',
        testData.initMaxValue
    )
    expect(store.dispatch).toHaveBeenCalledWith(
        'modApiRequests/applyFilter'
    )
})

test('Test changing of sliderValues min', async () => {
    //expected before actions
    expect(wrapper.find('.text-left').find('span').text()).toBe(testData.initMinValue.toString())

    //test actions
    wrapper.setData({ sliderValues: [ testData.selectMinValue , testData.initMaxValue ] })
    await wrapper.vm.onDragEnd()
    
    //expected after actions
    expect(store.commit).toHaveBeenCalledWith(
        'modApiRequests/setSelectedPriceMin',
        testData.selectMinValue,
    )
    expect(wrapper.find('.text-left').find('span').text()).toBe(testData.selectMinValue.toString())
})

test('Test changing of sliderValues max', async () => {
    //expected before action
    expect(wrapper.find('.text-right').find('span').text()).toBe(testData.initMaxValue.toString())

    //test actions
    wrapper.setData({ sliderValues: [ testData.initMinValue , testData.selectMaxValue ] })
    await wrapper.vm.onDragEnd()

    //expected after actions
    expect(store.commit).toHaveBeenCalledWith(
        'modApiRequests/setSelectedPriceMax',
        testData.selectMaxValue
    )
    expect(wrapper.find('.text-right').find('span').text()).toBe(testData.selectMaxValue.toString())
})
