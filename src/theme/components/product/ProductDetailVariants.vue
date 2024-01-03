<template>
    <div v-for="variantGroup in variants" :key="variantGroup.id" class="form-control mb-2">
        <div class="mb-2 label-text">
            {{ variantGroup.name }}
        </div>
        <div class="flex flex-wrap gap-4">
            <div v-for="variantOption in variantGroup.options" :key="variantOption.id">
                <label
                    :class="{
                        'btn-outline': selectedOptions[variantGroup.id] !== variantOption.id,
                        'btn-circle': variantOption.color != null || variantOption.media != null,
                        'btn-disabled': loading
                    }"
                    class="btn btn-secondary cursor-pointer"
                >
                    <div v-if="variantOption.color != null" class="avatar">
                        <div class="w-8 rounded-full" :style="`background-color: ${variantOption.color};`" />
                    </div>
                    <span v-else-if="variantOption.media != null" class="avatar">
                        <div class="w-8 rounded-full">
                            <img :src="variantOption.media.url" :alt="variantOption.media.alt">
                        </div>
                    </span>
                    <span v-else>{{ variantOption.name }}</span>
                    <input
                        v-model="selectedOptions[variantGroup.id]"
                        type="radio"
                        :disabled="loading"
                        :name="variantGroup.id"
                        :value="variantOption.id"
                        class="sr-only radio"
                        @change="onVariantChange(variantGroup.id, variantOption.id)"
                    >
                </label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { type HblProduct, type HblVariantGroup } from '@/utils/types'
import { useNotification, usePage } from '#imports'

const props = defineProps<{
    variants: HblVariantGroup[],
    defaultOptions: HblProduct['defaultOptions'],
    parentId: string
}>()

const selectedOptions = ref({})
setDefaultOptions()

function setDefaultOptions () {
    props.variants.forEach((group) => {
        group.options.forEach((option) => {
            if (props.defaultOptions?.includes(option.id)) {
                selectedOptions.value[group.id] = option.id
            }
        })
    })
}

const { getProductVariant, loading, error } = usePage()
const { $hblBus } = useNuxtApp()
const { showNotification } = useNotification()
const emit = defineEmits<{(e: 'loading', loading: boolean): void }>()

async function onVariantChange (switchedOption: string, switchedGroup: string) {
    emit('loading', true)
    const variant = await getProductVariant(props.parentId, selectedOptions.value, switchedOption, switchedGroup)
    emit('loading', false)

    if (error.value) {
        // eslint-disable-next-line no-console
        console.log(error.value)
        showNotification(error.value.toString(), 'error', true)
        return
    }

    // Emit global event
    $hblBus.$emit('productVariantChanged', { data: variant })

    // Replace current url path with variant without losing optional GET params
    const newUrl = window.location.href.replace(
        window.location.pathname,
        variant.url
    )
    window.history.replaceState({}, variant.name, newUrl)
}
</script>
