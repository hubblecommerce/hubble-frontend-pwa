<template>
    <div
        v-for="index in repeat"
        :key="index"
        :class="classes"
        :style="styles"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProductDetailManufacturerProps } from '../product/ProductDetailManufacturer.vue'

interface Props {
    text?: boolean,
    round?: boolean,
    circle?: boolean,
    height?: string | number,
    width?: string | number,
    size?: 'small' | 'medium' | 'large',
    repeat?: string | number,
    animated?: boolean,
    sharp?: boolean,
    color?: string
}

const props = withDefaults(defineProps<Props>(), {
    text: false,
    round: false,
    circle: false,
    size: 'medium',
    repeat: 1,
    animated: true,
    sharp: true,
    color: 'bg-base-200'
})

const styles = computed(() => {
    let text
    if (props.text) {
        text = 'display: inline-block;'
    }

    let width = 'width: 100%;'
    if (props.width) {
        if (typeof props.width === 'number') {
            width = `width: ${props.width}px;`
        }
        if (typeof props.width === 'string') {
            width = `width: ${props.width};`
        }
    }

    let height = 'height: 24px;'
    if (props.size === 'small') {
        height = 'height: 24px;'
    }

    if (props.size === 'medium') {
        height = 'height: 32px;'
    }

    if (props.size === 'large') {
        height = 'height: 48px;'
    }

    if (props.circle) {
        width = height.replace('height', 'width')
    }

    return [
        text,
        width,
        height
    ].join(' ')
})

const classes = computed(() => {
    let round
    if (props.round) {
        round = 'rounded-3xl'
    }

    if (!props.sharp) {
        round = 'rounded'
    }

    if (props.circle) {
        round = 'rounded-full'
    }

    let animated
    if (props.animated) {
        animated = 'animate-pulse'
    }

    return [
        round,
        animated,
        props.color
    ].join(' ')
})

</script>
