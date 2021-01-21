import { mount, createLocalVue } from '@vue/test-utils'
import Tabs from '@hubblecommerce/hubble/core/components/utils/Tabs'
import Tab from '@hubblecommerce/hubble/core/components/utils/Tab'

let wrapper

let testTabs = {
    template: `
        <tab name="placeholder1">
        <div>test1</div>
        </tab>
        <tab name="placeholder2">
        <div>test2</div>
        </tab>
        <tab name="placeholder3">
        <div>test3</div>
        </tab>
    `
}

beforeAll( async (done) => {
    const localVue = createLocalVue()
    localVue.component('tab', Tab)

    wrapper = mount(Tabs, {
        localVue,
        slots: {
            default: testTabs.template
        }
    })

    done()
})

test('Test active tab to change after tab is clicked', async () => {
    //expected before test action
    expect(wrapper.vm.activeTabHash).toBe('#placeholder1')
    expect(wrapper.vm.activeTabIndex).toBe(0)
    expect(wrapper.find('.tabs-component-panels').html()).toContain('<div>test1</div>')
    expect(wrapper.find('.tabs-component-panels').html()).not.toContain('<div>test3</div>')

    //test action
    await wrapper.findAll('.tabs-component-tab-a').at(2).trigger('click')

    //expected after action
    expect(wrapper.vm.activeTabHash).toBe('#placeholder3')
    expect(wrapper.vm.activeTabIndex).toBe(2)
    expect(wrapper.find('.tabs-component-panels').html()).toContain('<div>test3</div>')
    expect(wrapper.find('.tabs-component-panels').html()).not.toContain('<div>test1</div>')
})
