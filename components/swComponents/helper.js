export const blockMixins = {
    methods: {
        getSlotByPosition(slots, position) {
            let type = '';
            _.forEach(slots, (slot) => {
                if (slot.slot === position) {
                    type = slot.type;
                }
            });
            return this.getSlotByType(type);
        },
        getSlotByType(type) {
            return () => import('./slots/' + type).catch(() => {
                return import('./NoComponent');
            });
        },
        getContentByType(slots, type) {
            let slotContent  = {};
            _.forEach(slots, (slot) => {
                if (slot.type === type) {
                    slotContent = slot;
                }
            });
            return slotContent;
        },
        getContentByPosition(slots, position) {
            let slotContent  = {};
            _.forEach(slots, (slot) => {
                if (slot.slot === position) {
                    slotContent = slot;
                }
            });
            return slotContent;
        }
    }
};

export const sectionMixins = {
    methods: {
        getBlockByType(type) {
            return () => import('./blocks/' + type).catch(() => {
                return import('./NoComponent');
            });
        },
    }
};
