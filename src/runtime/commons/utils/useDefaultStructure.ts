import { PageType, Section } from '../interfaces'

const defaultStructure: Section[] = [
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
                        type: 'text'
                    }
                ]
            }
        ]
    }
]

export function useDefaultStructure () {
    const defaultStructures = new Map<PageType, Section[]>()

    const setDefaultStructures = function () {
        defaultStructures.set('category', defaultStructure)
        defaultStructures.set('detail', defaultStructure)
        defaultStructures.set('cms', defaultStructure)
    }

    const getDefaultStructureByType = function (type: PageType): Section[] {
        return defaultStructures.get(type)
    }

    return {
        defaultStructures,
        setDefaultStructures,
        getDefaultStructureByType
    }
}
