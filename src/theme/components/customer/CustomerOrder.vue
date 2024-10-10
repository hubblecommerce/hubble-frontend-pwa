<template>
    <div class="grid grid-cols-12 gap-6 lg:gap-12">
        <div v-if="order.shippingAddress" class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                {{ t('customer.order.shippingAddress') }}
            </div>
            <div>
                <CustomerAddressRenderer :address="order.shippingAddress" />
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                {{ t('customer.order.billingAddress') }}
            </div>
            <div>
                <CustomerAddressRenderer :address="order.billingAddress" />
            </div>
        </div>
        <div v-if="order.shippingMethod" class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                {{ t('customer.order.shippingMethod') }}
            </div>
            <div>
                <div>{{ order.shippingMethod.name }}</div>
                <div>{{ t('customer.order.deliveryTime') }}: {{ order.shippingMethod.deliveryTime }}</div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                {{ t('customer.order.paymentMethod') }}
            </div>
            <div>
                <div>{{ order.paymentMethod.name }}</div>
                <div>{{ order.paymentMethod.description }}</div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="hidden lg:grid grid-cols-12 px-2 py-1 font-bold">
                <div class="col-span-5">
                    {{ t('customer.order.tableDocument') }}
                </div>
                <div class="col-span-5">
                    {{ t('customer.order.tableDate') }}
                </div>
            </div>
            <div v-for="document in order.documents" :key="document.id" class="lg:grid lg:grid-cols-12 lg:items-center lg:p-2 gap-2">
                <div class="link flex lg:col-span-5 items-center" @click="downloadDocument(document)">
                    <DocumentIcon class="w-5 h-5 mr-2" />
                    <div class="break-words" v-text="document.fileName" />
                </div>
                <div class="mb-3 lg:col-span-5 lg:ml-0 lg:mb-0">
                    {{ formatDocumentDateTime(document.date) }}
                </div>
                <div class="hidden lg:block lg:col-span-2">
                    <button class="btn btn-outline ml-9 lg:ml-0" @click="openDocument(document)">
                        {{ t('customer.order.viewFile') }}
                    </button>
                </div>
            </div>
        </div>
        <div class="col-span-12">
            <div
                v-for="item in order.lineItems"
                :key="item.id"
                class="flex pb-4 mb-4 border border-base-content border-l-0 border-r-0 border-t-0"
            >
                <div class="avatar indicator mr-4">
                    <span class="indicator-item indicator-bottom badge badge-secondary">{{ item.quantity }}</span>
                    <div class="w-20">
                        <img v-if="item?.media?.url" :src="item.media.url" :alt="item.name">
                        <img v-else src="~/assets/product/placeholder-image.png" class="d-block h-auto" :alt="item.name">
                    </div>
                </div>

                <div class="flex flex-col justify-between w-full px-2">
                    <div class="w-full flex justify-between gap-2">
                        <div class="w-full">
                            {{ item.name }}
                        </div>
                    </div>
                    <div class="self-end w-full text-right text-sm">
                        <div v-if="item.price">
                            {{ formatPrice(item.price) }}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div
                            v-for="download in filterDownloads(item.downloads)"
                            :key="download.id"
                            class="link"
                            @click="downloadLineItemFile(download)"
                        >
                            {{ download.fileName }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-4 md:col-start-9">
            <table class="table table-compact table-zebra w-full">
                <tbody>
                    <tr>
                        <td>{{ t('customer.order.subTotal') }}</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.subTotal) }}
                        </td>
                    </tr>
                    <tr v-if="order.shippingMethod">
                        <td>{{ t('customer.order.shipping') }}</td>
                        <td class="text-right">
                            {{ formatPrice(order.shippingMethod.price) }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ t('customer.order.totalNet') }}</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.nettoPrice) }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ t('customer.order.tax') }} {{ order.totals.taxRate }}%</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.tax) }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ t('customer.order.totalGross') }}</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.bruttoPrice) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { type HblOrderDocument, type HblOrderLineItemDownload, type HblOrder } from '@/utils/types'
import { useCurrency, useCustomer, useNotification } from '#imports'

const props = defineProps<{
    order: HblOrder
}>()

const { getOrderLineItemDownload, getOrderDocumentDownload } = useCustomer()
const { formatPrice } = useCurrency()
const { showNotification } = useNotification()
const { t } = useI18n()

function filterDownloads (downloads: HblOrderLineItemDownload[]) {
    return downloads?.filter(download => download.canBeDownloaded)
}

function formatDocumentDateTime (date: Date) {
    return new Date(date).toLocaleDateString('de-CH', { hour: '2-digit', minute: '2-digit' })
}

async function downloadDocument (document: HblOrderDocument) {
    try {
        const blob = await getOrderDocumentDownload(document.id, document.deepLinkCode)

        downloadFile(blob, document.fileName)
    } catch (e) {
        showNotification(e, 'error', true)
    }
}

async function openDocument (document: HblOrderDocument) {
    try {
        const blob = await getOrderDocumentDownload(document.id, document.deepLinkCode)

        openFile(blob)
    } catch (e) {
        showNotification(e, 'error', true)
    }
}

async function downloadLineItemFile (download: HblOrderLineItemDownload) {
    try {
        const blob = await getOrderLineItemDownload(props.order.id, download.id)

        downloadFile(blob, download.fileName)
    } catch (e) {
        showNotification(e, 'error', true)
    }
}

const openFile = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(url), 7000)
}

const downloadFile = (blob: Blob, fileName: string) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.append(link)
    link.click()
    link.remove()
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000)
}
</script>
<i18n>
{
    "en": {
        "customer.order.billingAddress": "Billing Address",
        "customer.order.shippingAddress": "Shipping Address",
        "customer.order.shippingMethod": "Shipping Method",
        "customer.order.deliveryTime": "Delivery Time",
        "customer.order.paymentMethod": "Payment Method",
        "customer.order.tableDocument": "Document",
        "customer.order.tableDate": "Date",
        "customer.order.viewFile": "View file",
        "customer.order.subTotal": "Subtotal",
        "customer.order.shipping": "Shipping",
        "customer.order.totalNet": "Total (netto)",
        "customer.order.tax": "Tax",
        "customer.order.totalGross": "Total (brutto)"
    },
    "de": {
        "customer.order.billingAddress": "Rechnungsadresse",
        "customer.order.shippingAddress": "Lieferadresse",
        "customer.order.shippingMethod": "Liefermethode",
        "customer.order.deliveryTime": "Lieferzeit",
        "customer.order.paymentMethod": "Bezahlmethode",
        "customer.order.tableDocument": "Dokument",
        "customer.order.tableDate": "Datum",
        "customer.order.viewFile": "Datei ansehen",
        "customer.order.subTotal": "Zwischensumme",
        "customer.order.shipping": "Lieferkosten",
        "customer.order.totalNet": "Gesamt (netto)",
        "customer.order.tax": "Steuern",
        "customer.order.totalGross": "Gesamt (brutto)"
    }
}
</i18n>
