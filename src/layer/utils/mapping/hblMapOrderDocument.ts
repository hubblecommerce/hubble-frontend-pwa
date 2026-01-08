import { type Document as SwDocument } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrderDocument } from '../../types'

export function hblMapOrderDocument (document: SwDocument): HblOrderDocument {
    return {
        id: document?.id != null ? document?.id : '',
        deepLinkCode: document.deepLinkCode,
        fileName: buildFileName(document),
        // @ts-ignore
        date: document.config.documentDate
    }
}

function buildFileName (document: SwDocument) {
    // @ts-ignore
    const d = new Date(document.config.documentDate)
    const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    // @ts-ignore
    return `${document.config.name.replace(' ', '-')}_${document.config.documentNumber}_${date}.${document.fileType}`
}
