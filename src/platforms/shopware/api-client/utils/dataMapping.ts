import {
    Category as swCategory,
    Product as swProduct,
    CmsSection,
    CmsBlock,
    CmsSlot,
    ProductMedia,
    Media as swMedia,
    ProductListingResult,
    ProductManufacturer,
    SalesChannelContext,
    Country as SwCountry,
    Cart as SwCart,
    LineItem as SwLineItem,
    Salutation as SwSalutation,
    CustomerAddress as SwCustomerAddress,
    ShippingMethod as SwShippingMethod,
    PaymentMethod as SwPaymentMethod,
    Order as SwOrder,
    OrderAddress,
    OrderLineItem as SwOrderLineItem,
    PropertyGroup,
    PropertyGroupOption,
    NavigationRouteResponse
} from '../generated'
import {
    Block,
    Breadcrumb,
    Cart,
    Category,
    Customer,
    LineItem,
    Manufacturer,
    Media,
    MiniCart,
    Page,
    Session,
    Price,
    Product,
    ProductListing,
    Salutation,
    Country,
    Section,
    Slot,
    CustomerShippingAddress,
    CustomerBillingAddress,
    ShippingMethod,
    PaymentMethod,
    Order,
    Totals,
    OrderLineItem,
    ProductListingFilterMulti,
    ProductListingFilterRange,
    ProductListingFilterBoolean,
    ProductListingFilterMixed,
    ProductListingFilterCurrent,
    ProductListingSorting,
    VariantGroup,
    VariantOption,
    Navigation
} from '@hubblecommerce/hubble/commons'

function mapMedia (swMedia: swMedia): Media {
    if (swMedia === null) {
        return null
    }

    return {
        id: swMedia.id,
        url: swMedia.url,
        thumbnails: swMedia.thumbnails,
        alt: swMedia.alt,
        title: swMedia.title
    }
}

function mapProductMedia (swMedia: ProductMedia[]): Media[] | null {
    if (swMedia === null) {
        return null
    }

    const media = []

    swMedia = swMedia.sort(function (a, b) {
        return a.position - b.position
    })

    swMedia.forEach((element) => {
        media.push(mapMedia(element.media))
    })

    return media
}

function mapManufacturer (swManufacturer: ProductManufacturer): Manufacturer {
    return {
        id: swManufacturer.id,
        link: swManufacturer.link,
        name: swManufacturer.translated.name,
        description: swManufacturer.translated.description,
        media: mapMedia(swManufacturer.media)
    }
}

// TODO Patch api client: create calculated price type
function mapPrice (calculatedPrice): Price {
    return {
        regularPrice: calculatedPrice?.unitPrice,
        specialPrice: calculatedPrice?.listPrice?.price
    }
}

function mapVariantOption (swPropertyOption: PropertyGroupOption): VariantOption {
    return {
        id: swPropertyOption.id,
        name: swPropertyOption.translated.name,
        ...(swPropertyOption.colorHexCode != null && { color: swPropertyOption.colorHexCode }),
        ...(swPropertyOption.media != null && { media: mapMedia(swPropertyOption.media) })
    }
}

function mapPropertyOptions (swPropertyOptions: PropertyGroupOption[]): VariantOption[] {
    return swPropertyOptions.map((swPropertyOption) => {
        return mapVariantOption(swPropertyOption)
    })
}

function mapVariantGroup (swPropertyGroup: PropertyGroup): VariantGroup {
    return {
        id: swPropertyGroup.id,
        name: swPropertyGroup.translated.name,
        // Todo patch api
        // @ts-ignore
        options: mapPropertyOptions(swPropertyGroup.options)
    }
}

function mapVariantGroups (swPropertyGroups: PropertyGroup[]): VariantGroup[] {
    return swPropertyGroups.map((swPropertyGroup) => {
        return mapVariantGroup(swPropertyGroup)
    })
}

function mapProduct (swProduct: swProduct, swProductConfigurator?: PropertyGroup[]): Product {
    let url = swProduct.seoUrls[0]?.pathInfo
    const pathInfo = swProduct.seoUrls[0]?.pathInfo
    if (swProduct.seoUrls[0]?.isCanonical) {
        url = swProduct.seoUrls[0]?.seoPathInfo
    }
    if (!url.startsWith('/')) {
        url = '/' + url
    }

    let media = null
    if (swProduct.media != null) {
        media = mapProductMedia(swProduct.media)
    } else if (swProduct.cover?.media != null) {
        media = mapMedia(swProduct.cover.media)
    }

    let variants = null
    if (swProductConfigurator != null && swProductConfigurator.length > 0) {
        variants = mapVariantGroups(swProductConfigurator)
    }

    let defaultOptions = null
    if (swProduct.optionIds != null) {
        defaultOptions = swProduct.optionIds
    }

    let parentId = null
    if (swProduct.parentId != null) {
        parentId = swProduct.parentId
    }

    return {
        id: swProduct.id,
        name: swProduct.translated.name,
        description: swProduct.translated.description,
        sku: swProduct.productNumber,
        pathInfo,
        url,
        media,
        active: swProduct.available,
        stock: swProduct.stock,
        price: swProduct.calculatedPrice != null ? mapPrice(swProduct.calculatedPrice) : null,
        deliveryTime: swProduct.deliveryTime?.name,
        manufacturer: mapManufacturer(swProduct.manufacturer),
        metaTitle: swProduct.translated.metaTitle,
        metaDescription: swProduct.translated.metaDescription,
        variants,
        defaultOptions,
        parentId
    }
}

function mapProducts (swProducts: swProduct[]): Product[] {
    return swProducts.map((swProduct: swProduct) => {
        return mapProduct(swProduct)
    })
}

function mapBreadcrumb (swBreadcrumb): Breadcrumb {
    return swBreadcrumb
}

function mapFilters (swFilters: ProductListingResult['aggregations']): ProductListingFilterMixed[] {
    const filters = []

    const manufacturerFilter: ProductListingFilterMulti = {
        id: 'manufacturer',
        name: 'Manufacturer',
        type: 'multi',
        // TODO Patch api
        // @ts-ignore
        options: swFilters.manufacturer.entities.map((manufacturer) => {
            return {
                id: manufacturer.id,
                name: manufacturer.translated.name
            }
        })
    }

    const priceFilter: ProductListingFilterRange = {
        id: 'price',
        type: 'range',
        name: 'Price',
        // TODO Patch api
        // @ts-ignore
        min: swFilters.price.min,
        // @ts-ignore
        max: swFilters.price.max,
        // @ts-ignore
        avg: swFilters.price.avg,
        // @ts-ignore
        sum: swFilters.price.sum
    }

    const ratingFilter: ProductListingFilterRange = {
        id: 'rating',
        type: 'range',
        name: 'Rating',
        // TODO Patch api
        // @ts-ignore
        max: swFilters.rating.max != null ? swFilters.rating.max : '0',
        min: '0'
    }

    const shippingFilter: ProductListingFilterBoolean = {
        id: 'shipping-free',
        type: 'boolean',
        name: 'Shipping free'
    }

    filters.push(manufacturerFilter, priceFilter, ratingFilter, shippingFilter)

    // TODO Patch api
    // @ts-ignore
    swFilters.properties?.entities?.forEach((entity) => {
        const filter: ProductListingFilterMulti = {
            id: entity.id,
            name: entity.translated.name,
            type: 'multi',
            options: entity.options.map((option) => {
                return {
                    id: option.id,
                    name: option.name
                }
            })
        }

        filters.push(filter)
    })

    return filters
}

function mapCurrentFilters (swCurrentFilters: ProductListingResult['currentFilters'], swFilters): ProductListingFilterCurrent {
    const obj: ProductListingFilterCurrent = {}

    if (swCurrentFilters.navigationId != null) {
        obj.navigationId = swCurrentFilters.navigationId
    }

    // TODO Patch api
    // @ts-ignore
    if (swCurrentFilters.search != null) {
        // @ts-ignore
        obj.search = swCurrentFilters.search
    }

    obj.manufacturer = swCurrentFilters.manufacturer

    obj.price = {
        min: swCurrentFilters.price.min !== 0 ? swCurrentFilters.price.min : '',
        max: swCurrentFilters.price.max !== 0 ? swCurrentFilters.price.max : ''
    }

    obj.rating = {
        min: '',
        max: swCurrentFilters.rating !== null ? swCurrentFilters.rating : ''
    }

    obj['shipping-free'] = swCurrentFilters['shipping-free']

    swFilters.properties?.entities?.forEach((entity) => {
        const match = entity.options.filter((option) => {
            return swCurrentFilters.properties.includes(option.id)
        })

        const arrayOfIds = []
        match.forEach((option) => {
            arrayOfIds.push(option.id)
        })

        obj[entity.id] = arrayOfIds
    })

    return obj
}

function mapSorting (swSorting): ProductListingSorting {
    return {
        id: swSorting.key,
        name: swSorting.translated.label
    }
}

function mapSortings (swSortings: ProductListingResult['availableSortings']): ProductListingSorting[] {
    return swSortings.map((swSorting) => {
        return mapSorting(swSorting)
    })
}

function mapProductListing (swProductListing: ProductListingResult): ProductListing {
    return {
        products: mapProducts(swProductListing.elements),
        currentSorting: swProductListing.sorting,
        availableSorting: mapSortings(swProductListing.availableSortings),
        currentFilters: mapCurrentFilters(swProductListing.currentFilters, swProductListing.aggregations),
        availableFilters: mapFilters(swProductListing.aggregations),
        total: swProductListing.total,
        limit: swProductListing.limit,
        page: swProductListing.page
    }
}

function mapSlots (swSlots: CmsSlot[]): Slot[] {
    let productListing = null
    let media = null

    return swSlots.map((slot: CmsSlot) => {
        if (slot.data?.listing != null) {
            productListing = mapProductListing(slot.data.listing)
        }

        if (slot.data?.media != null) {
            media = mapMedia(slot.data.media)
        }

        return {
            type: slot.type,
            position: slot.slot,
            data: slot.data,
            productListing,
            media
        }
    })
}

function mapBlocks (swBlocks: CmsBlock[]): Block[] {
    return swBlocks.map((block) => {
        return {
            id: block._uniqueIdentifier,
            type: block.type,
            cssClass: block.cssClass,
            backgroundColor: block.backgroundColor,
            backgroundMedia: mapMedia(block.backgroundMedia),
            backgroundMediaMode: block.backgroundMediaMode,
            slots: mapSlots(block.slots),
            sectionPosition: block.sectionPosition
        }
    })
}

function mapSections (swSections: CmsSection[]): Section[] {
    return swSections.map((section: CmsSection) => {
        return {
            type: section.type,
            name: section.name,
            cssClass: section.cssClass,
            sizingMode: section.sizingMode,
            backgroundColor: section.backgroundColor,
            backgroundMedia: mapMedia(section.backgroundMedia),
            backgroundMediaMode: section.backgroundMediaMode,
            mobileSidebarBehavior: section.mobileBehavior,
            blocks: mapBlocks(section.blocks)
        }
    })
}

function mapCategory (swCategory: swCategory): Category {
    return {
        id: swCategory.id,
        active: swCategory.active,
        name: swCategory.translated.name,
        media: mapMedia(swCategory.media),
        description: swCategory.translated.description,
        metaTitle: swCategory.metaTitle,
        metaDescription: swCategory.metaDescription,
        url: swCategory.seoUrls[0].seoPathInfo.startsWith('/') ? swCategory.seoUrls[0].seoPathInfo : '/' + swCategory.seoUrls[0].seoPathInfo,
        pathInfo: `/navigation/${swCategory.id}`
    }
}

function mapPage (swPage): Page {
    const obj = {
        id: swPage.resourceIdentifier,
        canonicalUrl: swPage.canonicalPathInfo,
        type: swPage.resourceType,
        structure: null
    }

    if (swPage.resourceType === 'frontend.navigation.page') {
        Object.assign(obj, { type: 'category' })
    }

    if (swPage.resourceType === 'frontend.detail.page') {
        Object.assign(obj, { type: 'detail' })
    }

    if (swPage.resourceType === 'frontend.landing.page') {
        Object.assign(obj, { type: 'cms' })
    }

    if (swPage.cmsPage != null) {
        obj.structure = mapSections(swPage.cmsPage?.sections)

        Object.assign(obj, { cms: { content: swPage.cmsPage.name } })
    }

    if (swPage.breadcrumb !== undefined) {
        Object.assign(obj, { breadcrumb: mapBreadcrumb(swPage.breadcrumb) })
    }

    if (swPage.product != null) {
        Object.assign(obj, {
            detail: mapProduct(
                swPage.product,
                swPage.configurator != null ? swPage.configurator : null
            )
        })
    }

    if (swPage.category != null) {
        Object.assign(obj, { category: mapCategory(swPage.category) })
    }

    return obj
}

function mapSession (swPlatform: SalesChannelContext): Session {
    return {
        sessionToken: swPlatform.token,
        currency: swPlatform.currency.isoCode,
        language: swPlatform.salesChannel.languageId,
        maintenance: swPlatform.salesChannel.maintenance,
        // TODO: path api client
        // @ts-ignore
        shippingMethod: mapShippingMethod(swPlatform.shippingMethod),
        // TODO: path api client
        // @ts-ignore
        paymentMethod: mapPaymentMethod(swPlatform.paymentMethod)
    }
}

function reverseMapCustomerAddress (address: CustomerShippingAddress | CustomerBillingAddress): SwCustomerAddress {
    return {
        createdAt: '',
        customerId: '',
        salutationId: address.salutation,
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        zipcode: address.zipcode,
        city: address.city,
        countryId: address.country,
        ...(address.company != null && { company: address.company }),
        ...(address.phone != null && { phone: address.phone })
    }
}

function mapCustomerAddress (swAddress: SwCustomerAddress | OrderAddress): CustomerShippingAddress | CustomerBillingAddress {
    let salutationId = null
    // @ts-ignore
    if (swAddress.salutationId != null) {
        // @ts-ignore
        salutationId = swAddress.salutationId
    } else {
        salutationId = swAddress.salutation?.id
    }

    return {
        id: swAddress.id,
        salutation: salutationId,
        firstName: swAddress.firstName,
        lastName: swAddress.lastName,
        ...(swAddress.company != null && { company: swAddress.company }),
        street: swAddress.street,
        zipcode: swAddress.zipcode,
        city: swAddress.city,
        country: swAddress.countryId,
        ...(swAddress.phoneNumber != null && { phone: swAddress.phoneNumber })
    }
}

function mapCustomerAddresses (swAddresses: SwCustomerAddress[]): CustomerShippingAddress[] | CustomerBillingAddress[] {
    return swAddresses.map((swAddress) => {
        return mapCustomerAddress(swAddress)
    })
}

function mapCustomer (customer: SalesChannelContext['customer']): Customer {
    const obj: Customer = {
        name: customer.firstName,
        email: customer.email,
        isGuest: customer.guest
    }

    // Todo patch api client
    // @ts-ignore
    if (customer.activeShippingAddress != null) {
        // Todo patch api client
        // @ts-ignore
        Object.assign(obj, { shippingAddress: mapCustomerAddress(customer.activeShippingAddress) })
    }

    // Todo patch api client
    // @ts-ignore
    if (customer.activeBillingAddress != null) {
        // Todo patch api client
        // @ts-ignore
        Object.assign(obj, { billingAddress: mapCustomerAddress(customer.activeBillingAddress) })
    }

    /*
     * Remove id and compare mapped shipping and billing address to tell if they are the same or not
     */
    if (obj.shippingAddress != null && obj.billingAddress != null) {
        const { id: shippingId, ...cleanedShippingAddress } = obj.shippingAddress
        const { id: billingId, ...cleanedBillingAddress } = obj.billingAddress
        obj.billingSameAsShipping = JSON.stringify(cleanedShippingAddress) === JSON.stringify(cleanedBillingAddress)
    }

    return obj
}

function mapLineItem (lineItem: SwLineItem): LineItem {
    return {
        id: lineItem.id,
        itemId: lineItem.referencedId,
        name: lineItem.label,
        quantity: lineItem.quantity,
        type: lineItem.type,
        // @TODO Patch api client
        // @ts-ignore
        media: mapMedia(lineItem.cover),
        // @ts-ignore
        price: mapPrice(lineItem.price)
    }
}

function mapLineItems (lineItems: SwLineItem[]): LineItem[] {
    return lineItems.map((lineItem) => {
        return mapLineItem(lineItem)
    })
}

function mapTotals (price): Totals {
    return {
        subTotal: price.positionPrice,
        nettoPrice: price.netPrice,
        bruttoPrice: price.totalPrice,
        // @ts-ignore
        tax: price.calculatedTaxes.length > 0 ? price.calculatedTaxes[0].tax : null,
        // @ts-ignore
        taxRate: price.calculatedTaxes.length > 0 ? price.calculatedTaxes[0].taxRate : null
    }
}

function mapCart (cart: SwCart): Cart {
    return {
        id: cart.token,
        lineItems: mapLineItems(cart.lineItems),
        price: mapTotals(cart.price),
        // @TODO: Patch api client, add missing deliveries types
        // @ts-ignore
        shippingCosts: cart.deliveries.length > 0 ? cart.deliveries[0].shippingCosts.totalPrice : null,
        comment: cart.customerComment
    }
}

function mapMiniCart (cart: Cart): MiniCart {
    let quantity = 0
    const items = []
    cart.lineItems.forEach((lineItem) => {
        quantity = quantity + lineItem.quantity

        items.push({
            id: lineItem.id,
            itemId: lineItem.itemId,
            qty: lineItem.quantity
        })
    })

    return {
        id: cart.id,
        items,
        qty: quantity
    }
}

function mapSalutation (salutation: SwSalutation): Salutation {
    return {
        id: salutation.id,
        name: salutation.displayName
    }
}

function mapSalutations (salutations: SwSalutation[]): Salutation[] {
    return salutations.map((salutation) => {
        return mapSalutation(salutation)
    })
}

function mapCountry (country: SwCountry): Country {
    return {
        id: country.id,
        name: country.name
    }
}

function mapCountries (countries: SwCountry[]): Country[] {
    return countries.map((country) => {
        return mapCountry(country)
    })
}

function mapShippingMethod (swShippingMethod: SwShippingMethod): ShippingMethod {
    return {
        id: swShippingMethod.id,
        deliveryTime: swShippingMethod.deliveryTime?.translated.name,
        description: swShippingMethod.translated.description,
        media: mapMedia(swShippingMethod.media),
        name: swShippingMethod.translated.name,
        price: swShippingMethod.prices[0]?.currencyPrice[0]?.gross,
        tax: swShippingMethod.tax?.taxRate,
        // @ts-ignore
        position: swShippingMethod.position != null ? swShippingMethod.position : 1
    }
}

function mapShippingMethods (swShippingMethods: SwShippingMethod[]): ShippingMethod[] {
    return swShippingMethods.map((swShippingMethod) => {
        return mapShippingMethod(swShippingMethod)
    })
}

function mapPaymentMethod (swPaymentMethod: SwPaymentMethod): PaymentMethod {
    return {
        id: swPaymentMethod.id,
        // Todo patch api
        // @ts-ignore
        code: swPaymentMethod.shortName,
        position: swPaymentMethod.position != null ? swPaymentMethod.position : 1,
        name: swPaymentMethod.translated.name,
        ...(swPaymentMethod.translated.description != null && { description: swPaymentMethod.translated.description }),
        ...(swPaymentMethod.media != null && { media: mapMedia(swPaymentMethod.media) }),
        ...(swPaymentMethod.synchronous != null && { synchronous: swPaymentMethod.synchronous }),
        ...(swPaymentMethod.asynchronous != null && { asynchronous: swPaymentMethod.asynchronous })
    }
}

function mapPaymentMethods (swPaymentMethods: SwPaymentMethod[]): PaymentMethod[] {
    return swPaymentMethods.map((swPaymentMethod) => {
        return mapPaymentMethod(swPaymentMethod)
    })
}

function mapOrderLineItem (swOrderLineItem: SwOrderLineItem): OrderLineItem {
    return {
        id: swOrderLineItem.id,
        name: swOrderLineItem.label,
        media: mapMedia(swOrderLineItem.cover),
        quantity: swOrderLineItem.quantity,
        price: swOrderLineItem.totalPrice
    }
}

function mapOrderLineItems (swOrderLineItem: SwOrderLineItem[]): OrderLineItem[] {
    return swOrderLineItem.map((item) => {
        return mapOrderLineItem(item)
    })
}

function mapOrder (swOrder: SwOrder): Order {
    return {
        id: swOrder.id,
        orderNumber: swOrder.orderNumber,
        email: swOrder.orderCustomer.email,
        shippingAddress: mapCustomerAddress(swOrder.deliveries[0].shippingOrderAddress),
        billingAddress: mapCustomerAddress(swOrder.billingAddress),
        shippingMethod: mapShippingMethod(swOrder.deliveries[0].shippingMethod),
        paymentMethod: mapPaymentMethod(swOrder.transactions[0].paymentMethod),
        // TODO: patch api client
        // @ts-ignore
        lineItems: mapOrderLineItems(swOrder.lineItems),
        totals: mapTotals(swOrder.price),
        orderDate: swOrder.orderDate,
        status: swOrder.stateMachineState.translated.name
    }
}

function mapOrders (swOrders: SwOrder[]): Order[] {
    return swOrders.map((order) => {
        return mapOrder(order)
    })
}

function mapNavigation (swNavigation: NavigationRouteResponse): Navigation {
    return swNavigation.map((item) => {
        let children = []
        if (item.childCount > 0) {
            children = mapNavigation(item.children)
        }

        let url = null
        if (item.seoUrls.length > 0) {
            if (item.seoUrls[0].seoPathInfo !== undefined) {
                url = '/' + item.seoUrls[0].seoPathInfo
            }
        }

        return {
            id: item.id,
            name: item.name,
            url,
            children
        }
    })
}

export {
    mapCategory,
    mapMedia,
    mapProductMedia,
    mapBreadcrumb,
    mapProduct,
    mapSections,
    mapSlots,
    mapBlocks,
    mapPage,
    mapSession,
    mapCustomer,
    mapCustomerAddress,
    mapCustomerAddresses,
    reverseMapCustomerAddress,
    mapCart,
    mapMiniCart,
    mapProductListing,
    mapSalutations,
    mapSalutation,
    mapCountries,
    mapCountry,
    mapShippingMethods,
    mapShippingMethod,
    mapPaymentMethods,
    mapPaymentMethod,
    mapOrders,
    mapOrder,
    mapOrderLineItems,
    mapOrderLineItem,
    mapNavigation
}
