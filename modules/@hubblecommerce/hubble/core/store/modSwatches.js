export const state = () => ({
            swatches: [],

            attributes: [
                {
                    id: 149,
                    code: 'color_manufacturer',
                },
            ],

            byAttributeCode: {
                color_manufacturer: [
                    {
                        entity_id: 1,
                        attribute_id: 149,
                        option_id: 6,
                        small_color: '',
                        small_image: '6.png',
                        medium_color: '',
                        medium_image: '6.png',
                        big_color: '',
                        big_image: '6.png',
                    },
                ],
            },
})

export const getters = {
            getSwatches (state)  {
                return state.swatches;
            },
            getSwatchesByOptionId: state => (attrCode, optionId) => {
                let _index = state.byAttributeCode[attrCode].findIndex(item => item.option_id === optionId);

                return state.byAttributeCode[attrCode][_index];
            }
}
