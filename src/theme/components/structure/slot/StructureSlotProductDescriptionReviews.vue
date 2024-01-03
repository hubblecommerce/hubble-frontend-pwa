<template>
    <div class="tabs">
        <a :class="{ 'tab-active': activeTab === 'tab-1'}" class="tab tab-lg tab-bordered" @click="activeTab = 'tab-1'">
            Description
        </a>
        <a :class="{ 'tab-active': activeTab === 'tab-2'}" class="tab tab-lg tab-bordered " @click="activeTab = 'tab-2'">
            Reviews
        </a>
    </div>

    <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'tab-1'" class="py-6">
            {{ product.description }}
        </div>
        <div v-else-if="activeTab === 'tab-2'" class="py-6">
            Reviews
        </div>
    </transition>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { type HblProduct, type HblSlot } from '@/utils/types'
import { hblDetailData } from '@/utils/helper'

const props = defineProps<{
    content: HblSlot
}>()

const product = inject<HblProduct>(hblDetailData)

const activeTab = ref('tab-1')
</script>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
