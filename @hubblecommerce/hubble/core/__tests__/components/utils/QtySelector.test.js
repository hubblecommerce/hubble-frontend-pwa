import { mount, createLocalVue } from '@vue/test-utils'
import QtySelector from '@hubblecommerce/hubble/core/components/utils/QtySelector'

const $t = () => {}


test('Test decrease/increase of Quantity in buybox', async () => {
    let wrapper = mount(QtySelector, {
        propsData: {
            maxQty: 10,
        },
        mocks: {
            $t
        }
    })

    expect(wrapper.vm.qtySelected).toBe(1)

    await wrapper.findAll('button').at(1).trigger('click')

    expect(wrapper.vm.qtySelected).toBe(1)

    await wrapper.findAll('button').at(0).trigger('click')
    await wrapper.findAll('button').at(0).trigger('click')
    await wrapper.findAll('button').at(0).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.qtySelected).toBe(4)
    expect(wrapper.emitted().changeQty[2]).toEqual([4])

    await wrapper.findAll('input').at(0).setValue(10)

    expect(wrapper.vm.qtySelected).toBe("10")
    expect(wrapper.emitted().changeQty[3]).toEqual([10])
})

test('Test decrease/increase of Quantity in buybox', async () => {
    let wrapper = mount(QtySelector, {
        propsData: {
            maxQty: 10,
            type: true,
        },
        mocks: {
            $t
        }
    })

    expect(wrapper.vm.qtySelected).toBe(1)

    await wrapper.findAll('.select-text').at(0).findAll('option').at(3).setSelected()

    expect(wrapper.vm.qtySelected).toBe(3)

    await wrapper.findAll('.select-text').at(0).findAll('option').at(10).setSelected()

    expect(wrapper.vm.qtySelected).toBe(10)
})
