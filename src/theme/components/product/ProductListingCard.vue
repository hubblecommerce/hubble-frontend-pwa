<template>
    <div class="card card-compact bg-base-100 border border-base-200 shadow-md transition hover:shadow-xl">
        <figure>
            <MiscLink no-prefetch :to="data.url">
                <img v-if="isLoading || data.media == null" src="~/assets/product/placeholder-image.png" class="d-block m-auto mw-100" height="300" :alt="data.name">
                <img v-else :src="image.src" :alt="data.name">
            </MiscLink>
        </figure>
        <div class="card-body justify-between gap-4">
            <h2 class="card-title items-start" v-text="data.name" />
            <div class="card-text">
                <div :class="{ 'text-error': hasSpecialPrice}" class="text-xl font-medium">
                    <div v-if="data?.variantsFrom" class="text-base-700 text-sm font-light">
                        {{ t('productCard.variantsFrom') }}: {{ formatPrice(data?.cheapestPrice?.regularPrice) }}
                    </div>

                    <span v-if="data?.priceRange">{{ t('productCard.from') }}</span> {{ formatPrice(data.price?.regularPrice) }}

                    <span v-if="hasSpecialPrice" class="line-through text-xs text-base-content">
                        {{ formatPrice(data.price?.specialPrice) }}
                    </span>
                </div>
            </div>
            <div class="card-actions justify-center xl:justify-between">
                <MiscLink no-prefetch :to="data.url" class="btn btn-primary text-center" role="button">
                    {{ t('productCard.details') }}
                </MiscLink>
                <button
                    :class="{ 'loading': cartLoading }"
                    :disabled="cartLoading"
                    class="btn btn-secondary text-center"
                    role="button"
                    @click="onAddToCart()"
                >
                    {{ t('productCard.addToCart') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useImage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { HblProduct } from '@/utils/types'
import { useCart, useNotification, useCurrency, useLocalisation } from '#imports'

const { t } = useI18n()

const props = defineProps<{
    data: HblProduct
}>()

const { formatPrice } = useCurrency()
const { navigateToI18n } = useLocalisation()

const hasSpecialPrice = computed(() => {
    return props.data?.price?.specialPrice
})

const image = ref({
    src: Array.isArray(props.data.media) ? props.data.media[0]?.url : props.data.media?.url
})
const { isLoading } = useImage(image)

const cartStore = useCart()
const { loading: cartLoading, error: cartError } = storeToRefs(cartStore)
const { addToCart } = cartStore

async function onAddToCart () {
    if (props.data.parentId != null) {
        await navigateToI18n(props.data.url)
        return
    }

    await addToCart(1, props.data.id)
}

const { showNotification } = useNotification()
watch(cartError, (val) => {
    showNotification(val as string, 'error', true)
})
</script>

<style scoped>
.card-title {
    min-height: 84px;
}
</style>

<i18n>
{
    "en": {
        "productCard.variantsFrom": "Variants from",
        "productCard.from": "from",
        "productCard.details": "Details",
        "productCard.addToCart": "Add to cart"
    },
    "de": {
        "productCard.variantsFrom": "Varianten ab",
        "productCard.from": "ab",
        "productCard.details": "Details",
        "productCard.addToCart": "In den Warenkorb"
    }
}
</i18n>
