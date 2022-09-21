<template>
  <arrows v-if="recent.data">
    <div @scroll="scroll" id="eps" ref="eps"
      class="grid grid-rows-2 col-auto row-auto grid-flow-col-dense m-0 overflow-x-scroll w-full pr-5 pl-5">
      <nuxt-link :nuxt-child-key="episode.id" :to="`/watch/${episode.anime.slug}/${episode.number}`" :key="episode.id"
        v-for="(episode, index) in recent.data" class="p-0 m-0">
        <episode-card :key="episode.id" :anime="episode.anime" :title="episode.title" :id="episode.id"
          :number="episode.number" :createdAt="episode.createdAt" />
      </nuxt-link>
    </div>
  </arrows>
</template>

<script setup lang="ts">
  import { ref, watch } from '#imports';
  import { useFetch, useRuntimeConfig } from '#app';
  import { onMounted } from 'vue';

  const runtimeConfig = useRuntimeConfig();

  const page = ref(1);

  const { data: recent } = await useFetch(() => `${runtimeConfig.public.enimeApi}/recent?perPage=100`, {
    key: "/recent"
  });

  async function scroll(e: Event) {
    const eps = e.target as HTMLElement;

    if (eps.scrollLeft > 0)
      document.querySelector('.left')?.classList?.remove('disabled');
    else document.querySelector('.left')?.classList?.add('disabled');

    if (eps.scrollLeft + eps.clientWidth >= eps.scrollWidth - window.innerWidth) {
      page.value++;
      // eps.scrollLeft = eps.scrollWidth;
    }
  }
</script>

<script lang="ts">
</script>

<style scoped>

  /* Removes scrollbars, across chrome and ff */
  .overflow-x-scroll::-webkit-scrollbar {
    display: none;
  }
  .overflow-x-scroll {
    scrollbar-width: none;
  }
</style>