<template>
  <arrows>
    <div @scroll="scroll" id="eps" ref="eps"
      class="grid grid-rows-2 col-auto row-auto grid-flow-col-dense m-0 overflow-x-scroll w-full pr-5 pl-5">
      <nuxt-link :nuxt-child-key="episode.id" :to="`/watch/${episode.anime.slug}/${episode.number}`" :key="episode.id"
        v-for="(episode, index) in recent" class="p-0 m-0">
        <episode-card :key="episode.id" :anime="episode.anime" :title="episode.title" :id="episode.id"
          :number="episode.number" :createdAt="episode.createdAt" />
      </nuxt-link>
    </div>
  </arrows>
</template>

<script setup lang="ts">
  import { ref, watch } from '#imports';
  import { useFetch, useRuntimeConfig } from '#app';

  const runtimeConfig = useRuntimeConfig();
  // https://stackoverflow.com/a/42769683/10013227
  function convertRemToPixels(rem: number): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  let fullyloaded = false;

  const rem11 = convertRemToPixels(11);
  const rows = Math.ceil(window.innerWidth / rem11) * 2;

  const page = ref(1);
  const recent = ref([]);

  const { data } = await useFetch(() => `${runtimeConfig.public.enimeApi}/recent?page=${page.value}&perPage=${rows}`, {
    key: `/recent?page=${page.value}`
  });

  function load() {
    if (data.value) {
      if(data.value.meta.currentPage === data.value.meta.lastPage) {
        document.querySelector('.right')?.classList?.add('disabled'); fullyloaded = true; return; }
      else document.querySelector('.right')?.classList?.remove('disabled');
      for (let i = 0; i < rows; i++)
        recent.value.push(data.value.data[i]);
    }
  }
  load();

  watch(data, () => {
    load();
  });

  async function scroll(e: Event) {
    const eps = e.target as HTMLElement;

    if (eps.scrollLeft > 0)
      document.querySelector('.left')?.classList?.remove('disabled');
    else document.querySelector('.left')?.classList?.add('disabled');
    if(fullyloaded) {
      if(eps.scrollLeft >= eps.scrollWidth)
        document.querySelector('.right')?.classList?.add('disabled');
      else document.querySelector('.right')?.classList?.remove('disabled');
      return;
    }

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