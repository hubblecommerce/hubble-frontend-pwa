import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { state as apiStates ,actions as apiActions, mutations as apiMutations } from '@hubblecommerce/hubble/core/store/modApi'
import { state as categoryDataState, actions as categoryDataActions, mutations as categoryDataMutations } from '@hubblecommerce/hubble/core/store/sw/modApiCategory'
import { state as apiResourcesState, actions as apiResourcesActions, mutations as apiResourcesMutations, getters as apiResourcesGetters } from '@hubblecommerce/hubble/core/store/sw/modApiResources'
import { expectedCategoryData } from '../TestConfigs/modApiCategoryTestConfig'
import { generateTestArray } from '../TestUtils/computeTestArrays'

let categoryData
let categoryDataMappingTests

jest.setTimeout(10000);

beforeAll( async (done) => {
    const localVue = createLocalVue()
    localVue.use(Vuex)

    categoryDataMappingTests = await generateTestArray(expectedCategoryData)

    const moduleA = {
        state: apiStates,
        mutations: apiMutations,
        actions: apiActions
    }
    
    const moduleB = {
        state: categoryDataState,
        mutations: categoryDataMutations,
        actions: categoryDataActions,
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
            modApiCategory: moduleB,
            modApiResources: moduleC
        }
    })

    await store.dispatch('swGetCategory', expectedCategoryData.id)

    categoryData = store.state.modApiCategory.dataCategory.result.item

    done()
})

// Tests

test('Test category data mapping', () => {
    categoryDataMappingTests.forEach( (testData) => {
        let errorMessage = 'Error in element: ' + testData[0]
        expect(categoryData[testData[0]], errorMessage).toBeDefined()
        expect(typeof categoryData[testData[0]], errorMessage).toBe(testData[1])

        if((testData[1] != 'object') && (typeof categoryData[testData[0]] !== 'undefined'))
            expect(categoryData[testData[0]], errorMessage).toBe(testData[2])
    })
})
