<template>
    <div class="flex flex-col">
        <div role="tablist" class="tabs tabs-bordered mr-auto">
            <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'tab-1'}" @click="activeTab = 'tab-1'">Description</a>
            <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'tab-2'}" @click="activeTab = 'tab-2'">Reviews</a>
        </div>

        <div class="py-6">
            <template v-if="activeTab === 'tab-1'">
                {{ product?.description }}
            </template>
            <template v-if="activeTab === 'tab-2'">
                Reviews
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { type HblProduct, type HblSlot } from '../../../types'
import { hblDetailData } from '../../../utils/helper'

const props = defineProps<{
    content: HblSlot
}>()

const product = inject<HblProduct>(hblDetailData)
const activeTab = ref('tab-1')
</script>
