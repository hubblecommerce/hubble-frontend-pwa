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
    Navigation, MiniCartItem
} from '@hubblecommerce/hubble/commons'

function mapMedia (swMedia: swMedia): Media | null {
    if (swMedia === null) {
        return null
    }

    return {
        id: swMedia.id,
        // @ts-ignore
        url: swMedia.url,
        // @ts-ignore
        thumbnails: swMedia.thumbnails,
        // @ts-ignore
        alt: swMedia.alt,
        // @ts-ignore
        title: swMedia.title
    }
}

function mapProductMedia (swMedia: ProductMedia[]): Media[] | null {
    if (swMedia === null) {
        return null
    }

    const media: Media[] = []

    swMedia = swMedia.sort(function (a, b) {
        // @ts-ignore
        return a.position - b.position
    })

    swMedia.forEach((element) => {
        // @ts-ignore
        const mappedMedia = mapMedia(element?.media)
        if (mappedMedia != null) {
            media.push(mappedMedia)
        }
    })

    return media
}

function mapManufacturer (swManufacturer: ProductManufacturer): Manufacturer {
    return {
        // @ts-ignore
        id: swManufacturer.id,
        link: swManufacturer.link,
        name: swManufacturer.translated.name,
        description: swManufacturer.translated.description,
        // @ts-ignore
        media: mapMedia(swManufacturer.media)
    }
}

// @ts-ignore
function mapPrice (calculatedPrice): Price {
    return {
        regularPrice: calculatedPrice?.unitPrice,
        specialPrice: calculatedPrice?.listPrice?.price,
        tax: calculatedPrice?.calculatedTaxes[0]?.tax,
        taxRate: calculatedPrice?.calculatedTaxes[0]?.taxRate
    }
}

function mapVariantOption (swPropertyOption: PropertyGroupOption): VariantOption {
    return {
        // @ts-ignore
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
        // @ts-ignore
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
    let firstUrl = null
    if (swProduct?.seoUrls != null) {
        // @ts-ignore
        firstUrl = swProduct.seoUrls[0]
    }

    let url = firstUrl?.pathInfo
    const pathInfo = firstUrl?.pathInfo
    if (firstUrl?.isCanonical) {
        url = firstUrl?.seoPathInfo
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

    // calculatedPrice = price configured on settings base page of product
    let price = swProduct.calculatedPrice != null ? mapPrice(swProduct.calculatedPrice) : null

    // calculatedPrices = price based on advanced price rules
    // is an array because you can have tier-prices (prices based on quantity)
    // @ts-ignore
    if (swProduct.calculatedPrices?.length > 0) {
        // @ts-ignore
        price = mapPrice(swProduct.calculatedPrices[0])
    }

    return {
        // @ts-ignore
        id: swProduct.id,
        name: swProduct.translated.name,
        description: swProduct.translated.description,
        sku: swProduct.productNumber,
        pathInfo,
        url,
        // @ts-ignore
        active: swProduct.available,
        stock: swProduct.stock,
        // @ts-ignore
        price,
        deliveryTime: swProduct.deliveryTime?.name,
        manufacturer: swProduct.manufacturer != null ? mapManufacturer(swProduct.manufacturer) : null,
        metaTitle: swProduct.translated.metaTitle,
        metaDescription: swProduct.translated.metaDescription,
        ...(variants != null && { variants }),
        ...(defaultOptions != null && { defaultOptions }),
        ...(parentId != null && { parentId }),
        ...(media != null && { media })
    }
}

function mapProducts (swProducts: swProduct[]): Product[] {
    return swProducts.map((swProduct: swProduct) => {
        return mapProduct(swProduct)
    })
}

// @ts-ignore
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
            // @ts-ignore
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

// @ts-ignore
function mapCurrentFilters (swCurrentFilters: ProductListingResult['currentFilters'], swFilters): ProductListingFilterCurrent {
    const obj: ProductListingFilterCurrent = {}

    if (swCurrentFilters?.navigationId != null) {
        obj.navigationId = swCurrentFilters.navigationId
    }

    // TODO Patch api
    // @ts-ignore
    if (swCurrentFilters.search != null) {
        // @ts-ignore
        obj.search = swCurrentFilters.search
    }

    // @ts-ignore
    obj.manufacturer = swCurrentFilters?.manufacturer

    // @ts-ignore
    obj.price = {
        // @ts-ignore
        min: swCurrentFilters.price.min !== 0 ? swCurrentFilters.price.min : '',
        // @ts-ignore
        max: swCurrentFilters.price.max !== 0 ? swCurrentFilters.price.max : ''
    }

    // @ts-ignore
    obj.rating = {
        min: '',
        // @ts-ignore
        max: swCurrentFilters.rating !== null ? swCurrentFilters.rating : ''
    }

    // @ts-ignore
    obj['shipping-free'] = swCurrentFilters['shipping-free']

    // @ts-ignore
    swFilters.properties?.entities?.forEach((entity) => {
        // @ts-ignore
        const match = entity.options.filter((option) => {
            // @ts-ignore
            return swCurrentFilters.properties.includes(option.id)
        })

        const arrayOfIds: string[] = []
        // @ts-ignore
        match.forEach((option) => {
            arrayOfIds.push(option.id)
        })

        obj[entity.id] = arrayOfIds
    })

    return obj
}

// @ts-ignore
function mapSorting (swSorting): ProductListingSorting {
    return {
        id: swSorting.key,
        name: swSorting.translated.label
    }
}

function mapSortings (swSortings: ProductListingResult['availableSortings']): ProductListingSorting[] {
    // @ts-ignore
    return swSortings.map((swSorting) => {
        return mapSorting(swSorting)
    })
}

function mapProductListing (swProductListing: ProductListingResult): ProductListing {
    return {
        // @ts-ignore
        products: mapProducts(swProductListing.elements),
        currentSorting: swProductListing.sorting,
        availableSorting: mapSortings(swProductListing.availableSortings),
        currentFilters: mapCurrentFilters(swProductListing.currentFilters, swProductListing.aggregations),
        availableFilters: mapFilters(swProductListing.aggregations),
        // @ts-ignore
        total: swProductListing.total,
        // @ts-ignore
        limit: swProductListing.limit,
        // @ts-ignore
        page: swProductListing.page
    }
}

function mapSlots (swSlots: CmsSlot[]): Slot[] {
    let productListing: ProductListing | null = null
    let media: Media | null = null

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
            ...(productListing != null && { productListing }),
            ...(media != null && { media })
        }
    })
}

function mapBlocks (swBlocks: CmsBlock[]): Block[] {
    return swBlocks.map((block: CmsBlock) => {
        return {
            id: block._uniqueIdentifier,
            type: block.type,
            // @ts-ignore
            slots: mapSlots(block.slots),
            ...(block.cssClass != null && { cssClass: block.cssClass }),
            ...(block.backgroundColor != null && { backgroundColor: block.backgroundColor }),
            ...(block.backgroundMedia != null && { backgroundMedia: mapMedia(block.backgroundMedia) }),
            ...(block.backgroundMediaMode != null && { backgroundMediaMode: block.backgroundMediaMode }),
            ...(block.sectionPosition != null && { sectionPosition: block.sectionPosition })
        }
    })
}

function mapSections (swSections: CmsSection[]): Section[] {
    return swSections.map((section: CmsSection) => {
        return {
            type: section.type,
            name: section.name,
            sizingMode: section.sizingMode != null ? section.sizingMode : 'boxed',
            // @ts-ignore
            blocks: mapBlocks(section.blocks),
            ...(section.cssClass != null && { cssClass: section.cssClass }),
            ...(section.backgroundColor != null && { backgroundColor: section.backgroundColor }),
            ...(section.backgroundMedia != null && { backgroundMedia: mapMedia(section.backgroundMedia) }),
            ...(section.backgroundMediaMode != null && { backgroundMediaMode: section.backgroundMediaMode }),
            ...(section.mobileBehavior != null && { mobileSidebarBehavior: section.mobileBehavior })
        }
    })
}

function mapCategory (swCategory: swCategory): Category {
    return {
        // @ts-ignore
        id: swCategory.id,
        // @ts-ignore
        active: swCategory.active,
        name: swCategory.translated.name,
        // @ts-ignore
        media: mapMedia(swCategory.media),
        description: swCategory.translated.description,
        // @ts-ignore
        metaTitle: swCategory.metaTitle,
        // @ts-ignore
        metaDescription: swCategory.metaDescription,
        // @ts-ignore
        url: swCategory.seoUrls[0].seoPathInfo.startsWith('/') ? swCategory.seoUrls[0].seoPathInfo : '/' + swCategory.seoUrls[0].seoPathInfo,
        pathInfo: `/navigation/${swCategory.id}`
    }
}

// @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
        sessionToken: swPlatform.token,
        currency: swPlatform?.currency?.isoCode,
        language: swPlatform?.salesChannel?.languageId,
        maintenance: swPlatform?.salesChannel?.maintenance,
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
    let salutationId
    // @ts-ignore
    if (swAddress.salutationId != null) {
        // @ts-ignore
        salutationId = swAddress.salutationId
    } else {
        salutationId = swAddress.salutation?.id
    }

    return {
        // @ts-ignore
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
        // @ts-ignore
        salutationId: customer.salutationId,
        // @ts-ignore
        name: `${customer.firstName} ${customer.lastName}`,
        // @ts-ignore
        firstName: customer.firstName,
        // @ts-ignore
        lastName: customer.lastName,
        // @ts-ignore
        dateOfBirth: customer.birthday,
        // @ts-ignore
        email: customer.email,
        // @ts-ignore
        isGuest: customer.guest,
        // @ts-ignore
        newsletter: customer.newsletter,
        // @ts-ignore
        defaultPayment: customer.defaultPaymentMethodId
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
        // @ts-ignore
        id: lineItem.id,
        // @ts-ignore
        itemId: lineItem.referencedId,
        // @TODO Patch api client
        // @ts-ignore
        sku: lineItem.payload?.productNumber,
        // @ts-ignore
        name: lineItem.label,
        // @ts-ignore
        quantity: lineItem.quantity,
        type: lineItem.type,
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

// @ts-ignore
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
        // @ts-ignore
        id: cart.token,
        // @ts-ignore
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
    const items: MiniCartItem[] = []
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
        // @ts-ignore
        id: salutation.id,
        name: salutation.translated?.displayName
    }
}

function mapSalutations (salutations: SwSalutation[]): Salutation[] {
    return salutations.map((salutation) => {
        return mapSalutation(salutation)
    })
}

function mapCountry (country: SwCountry): Country {
    return {
        // @ts-ignore
        id: country.id,
        name: country.translated?.name
    }
}

function mapCountries (countries: SwCountry[]): Country[] {
    return countries.map((country) => {
        return mapCountry(country)
    })
}

function mapShippingMethod (swShippingMethod: SwShippingMethod): ShippingMethod {
    return {
        // @ts-ignore
        id: swShippingMethod.id,
        deliveryTime: swShippingMethod.deliveryTime?.translated.name,
        description: swShippingMethod.translated.description,
        // @ts-ignore
        media: mapMedia(swShippingMethod.media),
        name: swShippingMethod.translated.name,
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
        id: swOrderLineItem.id,
        name: swOrderLineItem.label,
        // @ts-ignore
        media: mapMedia(swOrderLineItem.cover),
        quantity: swOrderLineItem.quantity,
        // @ts-ignore
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
        // @ts-ignore
        id: swOrder.id,
        // @ts-ignore
        orderNumber: swOrder.orderNumber,
        // @ts-ignore
        email: swOrder.orderCustomer.email,
        // @ts-ignore
        shippingAddress: mapCustomerAddress(swOrder.deliveries[0].shippingOrderAddress),
        // @ts-ignore
        billingAddress: mapCustomerAddress(swOrder.billingAddress),
        // @ts-ignore
        shippingMethod: mapShippingMethod(swOrder.deliveries[0].shippingMethod),
        // @ts-ignore
        paymentMethod: mapPaymentMethod(swOrder.transactions[0].paymentMethod),
        // TODO: patch api client
        // @ts-ignore
        lineItems: mapOrderLineItems(swOrder.lineItems),
        totals: mapTotals(swOrder.price),
        // @ts-ignore
        orderDate: swOrder.orderDate,
        // @ts-ignore
        status: swOrder.stateMachineState.translated.name
    }
}

function mapOrders (swOrders: SwOrder[]): Order[] {
    return swOrders.map((order) => {
        return mapOrder(order)
    })
}

function mapNavigation (swNavigation: NavigationRouteResponse): Navigation {
    // @ts-ignore
    return swNavigation.map((item) => {
        let children: Navigation = []
        if (item.childCount != null && item.childCount > 0) {
            // @ts-ignore
            children = mapNavigation(item.children)
        }

        let url = null
        // @ts-ignore
        if (item.seoUrls.length > 0) {
            // @ts-ignore
            if (item.seoUrls[0].seoPathInfo !== undefined) {
                // @ts-ignore
                url = '/' + item.seoUrls[0].seoPathInfo
            }
        }

        return {
            id: item.id,
            name: item.translated.name,
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
    mapNavigation,
    mapLineItems,
    mapLineItem,
    mapTotals,
    mapPrice,
    mapManufacturer,
    mapVariantOption,
    mapPropertyOptions,
    mapVariantGroup,
    mapVariantGroups,
    mapProducts,
    mapFilters,
    mapCurrentFilters,
    mapSorting,
    mapSortings
}
