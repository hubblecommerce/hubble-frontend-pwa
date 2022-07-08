<template>
    <div
        class="structure-section"
        :class="{ [content.cssClass]: content.cssClass, 'container': content.sizingMode === 'boxed', 'container-fluid': content.sizingMode === 'fullwidth' }"
        :style="backgroundStyles"
        style="border: 1px solid blue;"
    >
        Section - Type {{ content.type }}
        <div class="row">
            <div
                v-if="content.type === 'sidebar'"
                :class="{ 'col-12': content.mobileSidebarBehavior === 'wrap','d-none': content.mobileSidebarBehavior === 'hidden' }"
                class="d-md-block col-md-3"
            >
                <StructureBlock v-for="(sidebarBlock) in sidebarBlocks" :key="sidebarBlock.id" :content="sidebarBlock" :count="count" />
            </div>
            <div :class="{ 'col-md-9': content.type === 'sidebar' }" class="col-12">
                <StructureBlock v-for="(mainBlock) in mainBlocks" :key="mainBlock.id" :content="mainBlock" :count="count" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, Ref } from 'vue'
import { Block, Section } from '../../../commons'

const props = defineProps<{
    count?: number
    content: Section
}>()

const backgroundStyles: Ref<string | null> = computed(() => {
    let styles = null

    if (props.content.backgroundColor !== null) {
        styles = `background-color: ${props.content.backgroundColor}; `
    }

    if (props.content.backgroundMedia !== null) {
        styles = `background: url('${props.content.backgroundMedia.url}'); `
    }

    if (props.content.backgroundMediaMode !== null) {
        styles += `background-size: ${props.content.backgroundMediaMode}; `
    }

    return styles
})

const mainBlocks: Ref<Block[]> = computed(() => {
    return props.content.blocks.filter((block: Block) => block.sectionPosition === 'main')
})

const sidebarBlocks: Ref<Block[]> = computed(() => {
    return props.content.blocks.filter((block: Block) => block.sectionPosition === 'sidebar')
})
</script>
