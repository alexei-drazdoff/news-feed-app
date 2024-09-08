<template>
    <div>
        <title>{{ title }}</title>
        <meta name="description" :content="description">
        <meta property="og:title" :content="title">
        <meta property="og:description" :content="description">
        <meta property="og:image" :content="image">
        <meta property="og:url" :content="url">
        <meta name="twitter:card" content="summary_large_image">
    </div>
</template>

<script setup>
defineProps({
    title: String,
    description: String,
    image: String,
    url: String
});
</script>