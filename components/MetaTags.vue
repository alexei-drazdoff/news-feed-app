<script setup lang="ts">
import { useServerSeoMeta, useRuntimeConfig, useRoute } from '#app'

interface MetaTagsProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

const props = withDefaults(defineProps<MetaTagsProps>(), {
  image: '/default-og-image.jpg',
  url: '',
  type: 'website'
})

const route = useRoute()
const config = useRuntimeConfig()

const siteUrl = config.public.siteUrl || 'http://localhost:3000'

useServerSeoMeta({
  title: () => props.title,
  ogTitle: () => props.title,
  description: () => props.description,
  ogDescription: () => props.description,
  ogImage: () => props.image,
  ogUrl: () => props.url || `${siteUrl}${route.fullPath}`,
  ogType: () => props.type,
  twitterCard: () => 'summary_large_image',
  twitterTitle: () => props.title,
  twitterDescription: () => props.description,
  twitterImage: () => props.image,
})
</script>

<template>
  <!-- This component doesn't render anything visible -->
</template>
