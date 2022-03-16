/*
Shopware CMS Helper Functions
*/
export default function returnSlotByType(type) {
    return () =>
        import('./slots/' + type + '-slot').catch(() => {
            return import('./NoComponent');
        });
}

export const slotMixins = {
    props: {
        content: {
            type: Object,
            default: () => {},
        },
        actAsType: {
            type: String,
            default: '',
        },
        sizingMode: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        elementClass() {
            let className = 'cms-element-' + this.content.type;
            if (this.actAsType) className = className.concat(' cms-element-' + this.actAsType);

            return className;
        },
    },
};

export const blockMixins = {
    props: {
        content: {
            type: Object,
            default: () => {},
        },
        sizingMode: {
            type: Object,
            default: () => {},
        },
    },

    methods: {
        getSlotByType(type) {
            return returnSlotByType(type);
        },
        getSlotByPosition(slots, position) {
            let typeName = '';
            slots.forEach((slot) => {
                if (slot.slot === position) {
                    typeName = slot.type;
                }
            });
            return returnSlotByType(typeName);
        },
        getContentByPosition(slots, position) {
            let slotContent = {};
            slots.forEach((slot) => {
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
};
