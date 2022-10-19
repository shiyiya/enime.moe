<template>
  <div class="cursor-pointer ms-5 mb-6 ml-3" style="width: 11rem;">
    <nuxt-img :src="anime.coverImage" loading="lazy" class="anime-image bg-cover bg-center rounded-md mb-3"/>
    <p class="text-sm text-tertiary text-overflow">EP{{ number }}<span v-if="title">: {{ title }}</span></p>
    <p class="text-overflow p-0 text-white anime-title">{{ gettitle(anime.title) }}</p>
  </div>
</template>

<script setup lang="ts">
import { gettitle } from 'assets/ts/helpers';
</script>

<script lang="ts">
export default {
  props: {
    anime: {
      title: {
        english: String,
        native: String,
        romaji: String
      },
      coverImage: String
    },
    number: Number,
    title: !String,
    createdAt: String
  },
}
</script>

<style scoped>
  .anime-image {
    aspect-ratio: 2/3;
  }
  .anime-title {
    font-size: 1.2rem;
    line-height: 1;
    font-weight: 400;
    margin-top: .1rem;
  }
</style>