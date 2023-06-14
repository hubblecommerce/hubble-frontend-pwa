import { HblPageType, HblSection } from '@/utils/types'

const hblDefaultStructure: HblSection[] = [
    {
        type: 'default',
        sizingMode: 'boxed',
        blocks: [
            {
                id: 'defaultBlock',
                type: 'text',
                sectionPosition: 'main',
                slots: [
                    {
                        data: 'This is a Fallback default Structure',
                        type: 'text',
                        productListing: null
                    }
                ]
            }
        ]
    }
]

const hblDefaultDetailStructure: HblSection[] = [
    {
        type: 'default',
        sizingMode: 'boxed',
        blocks: [
            {
                id: 'product-block-1',
                type: 'product-heading',
                sectionPosition: 'main',
                slots: [
                    {
                        type: 'product-name',
                        position: 'left',
                        productListing: null,
                        data: {
                            content: 'Product Name'
                        }
                    },
                    {
                        type: 'manufacturer-logo',
                        position: 'right',
                        productListing: null,
                        data: {
                            manufacturer: null,
                            mediaId: null,
                            url: '',
                            newTab: true,
                            media: null
                        }
                    }
                ]
            },
            {
                id: 'product-block-2',
                type: 'gallery-buybox',
                sectionPosition: 'main',
                slots: [
                    {
                        type: 'image-gallery',
                        position: 'left',
                        productListing: null,
                        data: {
                            sliderItems: [
                                {
                                    media: {
                                        // media object
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: 'buy-box',
                        position: 'right',
                        productListing: null,
                        data: {
                            product: {
                                // product object
                            }
                        }
                    }
                ]
            },
            {
                id: 'product-block-3',
                type: 'product-description-reviews',
                sectionPosition: 'main',
                slots: [
                    {
                        type: 'product-description-reviews',
                        position: 'content',
                        productListing: null,
                        data: {
                            reviews: 'Product Name',
                            product: {
                                // product object
                            }
                        }
                    }
                ]
            },
            {
                id: 'product-block-4',
                type: 'cross-selling',
                sectionPosition: 'main',
                slots: [
                    {
                        type: 'cross-selling',
                        position: 'content',
                        productListing: null,
                        data: {
                            crossSellings: null
                        }
                    }
                ]
            }
        ]
    }
]

export function hblUseDefaultStructure () {
    const defaultStructures = new Map<HblPageType, HblSection[]>()

    const setDefaultStructures = function () {
        defaultStructures.set('category', hblDefaultStructure)
        defaultStructures.set('detail', hblDefaultDetailStructure)
        defaultStructures.set('cms', hblDefaultStructure)
    }

    const getDefaultStructureByType = function (type: HblPageType): HblSection[] {
        // @ts-ignore
        return defaultStructures.get(type)
    }

    return {
        defaultStructures,
        setDefaultStructures,
        getDefaultStructureByType
    }
}
