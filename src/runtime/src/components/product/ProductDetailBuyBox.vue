<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title" v-text="product.name" />
            <div class="text-xs" v-text="product.sku" />

            <template v-if="product.active">
                <p>Availability: {{ product.stock > 10 ? 'in stock' : 'only a few left' }}</p>
                <p v-if="product.deliveryTime">
                    Delivery Time: {{ product.deliveryTime }}
                </p>
                <div class="card-actions justify-between items-end flex-nowrap">
                    <div class="form-control w-20">
                        <label for="quantity" class="label">
                            <span class="label-text">Quantity</span>
                        </label>
                        <input
                            id="quantity"
                            v-model="qty"
                            type="number"
                            min="1"
                            :max="product.stock"
                            class="input input-bordered input-secondary w-full max-w-xs"
                        >
                    </div>

                    <button class="btn btn-primary w-full flex-shrink">
                        Add to cart
                    </button>
                </div>
            </template>

            <p v-else>
                Sorry, currently not available
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Product } from '@hubblecommerce/hubble/commons'

defineProps<{
    product: Product
}>()

const qty = ref<number>(1)
</script>
