<template>
    <div class="breadcrumbs">
        <ul class="row">
            <li class="breadcrumb-item">
                <nuxt-link to="/" title="Back to Home">Home</nuxt-link>
            </li>
            <li class="breadcrumb-item" v-for="(element, index) in path" :key="index">
                <nuxt-link :to="'/'+element.url">
                    <span itemprop="title">{{ element.name }}</span>
                </nuxt-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Breadcrumbs",
        props: {
            path: {
                required: true,
                type: Array
            }
        }
    }
</script>
