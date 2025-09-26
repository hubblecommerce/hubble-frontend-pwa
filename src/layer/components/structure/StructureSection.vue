<template>
    <div
        class="structure-section"
        :class="{ [content.cssClass]: content.cssClass, 'container m-auto p-6': content.sizingMode === 'boxed', 'w-full': content.sizingMode === 'fullwidth' }"
        :style="backgroundStyles"
    >
        <div class="grid grid-cols-12 gap-4">
            <div
                v-if="content.type === 'sidebar'"
                :class="{ 'col-span-12': content.mobileSidebarBehavior === 'wrap','hidden': content.mobileSidebarBehavior === 'hidden' }"
                class="md:flex md:flex-col md:gap-4 md:col-span-3"
            >
                <StructureBlock v-for="(sidebarBlock) in sidebarBlocks" :key="sidebarBlock.id" :content="sidebarBlock" :count="count" />
            </div>
            <div :class="{ 'md:col-span-9': content.type === 'sidebar' }" class="flex flex-col gap-4 col-span-12">
                <StructureBlock v-for="(mainBlock) in mainBlocks" :key="mainBlock.id" :content="mainBlock" :count="count" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { type HblBlock, type HblSection } from '../../types'
import { hblGetStructureBackgroundStyles } from '../../utils/helper'

const props = defineProps<{
    count?: number
    content: HblSection
}>()

const { backgroundStyles } = hblGetStructureBackgroundStyles(props.content)

const mainBlocks: Ref<HblBlock[]> = computed(() => {
    return props.content.blocks.filter((block: HblBlock) => block.sectionPosition === 'main')
})

const sidebarBlocks: Ref<HblBlock[]> = computed(() => {
    return props.content.blocks.filter((block: HblBlock) => block.sectionPosition === 'sidebar')
})
</script>
