import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { state as apiStates ,actions as apiActions, mutations as apiMutations } from '@hubblecommerce/hubble/core/store/modApi'
import { state as productDataState, actions as productDataActions, mutations as productDataMutations } from '@hubblecommerce/hubble/core/store/sw/modApiProduct'
import { state as apiResourcesState, actions as apiResourcesActions, mutations as apiResourcesMutations, getters as apiResourcesGetters } from '@hubblecommerce/hubble/core/store/sw/modApiResources'
import { expectedProductData } from '../TestConfigs/modApiProductTestConfig'
import { generateTestArray } from '../TestUtils/computeTestArrays'

// Initialization of API data for testing

let productData
let productDataMappingTests

jest.setTimeout(10000);

beforeAll( async (done) => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    productDataMappingTests = await generateTestArray(expectedProductData)

    const moduleA = {
        state: apiStates,
        mutations: apiMutations,
        actions: apiActions
    }
    
    const moduleB = {
        state: productDataState,
        mutations: productDataMutations,
        actions: productDataActions,
    }

    const moduleC = {
        state: apiResourcesState,
        mutations: apiResourcesMutations,
        actions: apiResourcesActions,
        getters: apiResourcesGetters
    }

    const store = new Vuex.Store({
        modules: {
            a: moduleA,
            modApiProduct: moduleB,
            modApiResources: moduleC
        }
    })

    let response = await store.dispatch('getPage', expectedProductData.url_pds)
    
    productData = await store.dispatch('mappingProduct', { product: response.data.product })
    // console.log(productData)

    done()
})

test('Testing correct mapping of product data', () => {
    productDataMappingTests.forEach( (testData) => {
        let errorMessage = 'Error in element: ' + testData[0]
        if(Array.isArray(testData[1])){
            testData[1].forEach( (data) => {
                expect(productData[testData[0]][data[0]], errorMessage).toBeDefined()
                expect(typeof productData[testData[0]][data[0]], errorMessage).toBe(data[1])
                if(!Array.isArray(productData[testData[0]])){
                    expect(productData[testData[0]][data[0]], errorMessage).toEqual(data[2])
                }
            })
        }
        else{
            expect(productData[testData[0]], errorMessage).toBeDefined()
            expect(typeof productData[testData[0]], errorMessage).toBe(testData[1])
            expect(productData[testData[0]], errorMessage).toBe(testData[2])
        }
    })
})
