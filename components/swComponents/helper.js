/*
Shopware CMS Helper Functions
*/

function returnSlotByType(type) {
    return () =>
        import('./slots/' + type).catch(() => {
            return import('./NoComponent');
        });
}

function returnBlockByType(type) {
    return () =>
        import('./blocks/' + type).catch(() => {
            return import('./NoComponent');
        });
}

export const slotMixins = {
    computed: {
        elementClass() {
            return 'cms-element-' + this.content.type;
        },
    },
};

export const blockMixins = {
    methods: {
        getSlotByPosition(slots, position) {
            let typeName = '';
            _.forEach(slots, slot => {
                if (slot.slot === position) {
                    typeName = slot.type;
                }
            });
            return returnSlotByType(typeName);
        },
        getContentByPosition(slots, position) {
            let slotContent = {};
            _.forEach(slots, slot => {
                if (slot.slot === position) {
                    slotContent = slot;
                }
            });
            return slotContent;
        },
    },
};

export const sectionMixins = {
    computed: {
        blockClass() {
            return 'cms-block-' + this.content.type;
        },
    },
    methods: {
        getBlockByType(type) {
            return returnBlockByType(type);
        },
    },
};
