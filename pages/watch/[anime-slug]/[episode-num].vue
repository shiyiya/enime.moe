<template>
  <div>
    <div class="cont my-20 items-stretch" v-if="episode">
      <div class="episode">
        <Player v-if="sources?.length" :episode="episode" :anime="anime" :sources="sources"
          class="relative w-full aspect-video mb-8" />
        <div v-else>
          This episode does not have any source yet. Please wait for system to update.
        </div>
        <div class="m-2">
          <nuxt-link :href="`/anime/` + anime.slug">
            <p class="text-3xl">{{ preferredTitle }}</p>
          </nuxt-link>
          <p class="text-xl text-tertiary">Episode {{ number }}<span v-if="title" class="p-0">: {{ title }}
            </span>
          </p>
        </div>
      </div>
      <div class="pl-10 flex flex-col items-start justify-start overflow-y-auto m-0 p-0 w-70 h-full <lg:(w-0 hidden)">
        <span class="text-3xl mb-4 pl-3 m-0">Episodes</span>
        <div class="line"></div>
        <div ref="next-eps" class="next-eps flex flex-col py-3 p-0 m-0 justify-start overflow-y-auto w-full">
          <nuxt-link no-prefetch ref="episodeRefs" v-for="( ep, index ) in animeeps" :key="ep.id"
            :to="`/watch/${anime.slug}/${ep.number}`">
            <!-- :class="ep.number === number ? 'cur' : ''"> -->
            <div class="next-ep w-full px-1 py-2 relative">
              <episode-list-item :key="ep.id" :anime="anime" :number="ep.number" :title="ep.title" :image="ep.image"
                :airedAt="ep.airedAt" :createdAt="ep.createdAt" />
              <div v-if="ep.number === number" class="currenttext absolute top-0 right-0 left-0 bottom-0 bg-[#000000b0] font-bold text-5xl">Current<br/><br/>‎</div>
            </div>
          </nuxt-link>
        </div>
        <div class="line"></div>
      </div>
    </div>
    <arrows class=">lg:(w-0 hidden)">
      <div ref="eps" class="grid grid-rows-1 grid-flow-col-dense m-0 overflow-x-scroll w-full pr-5 pl-5">
        <nuxt-link no-prefetch :to="`/watch/${anime.slug}/${ep.number}`" v-for="ep in animeeps" :key="ep.id">
          <div class="w-44 mx-2 relative">
            <episode-list-item :anime="anime" :number="ep.number" :image="ep.image" :airedAt="ep.airedAt"
            :title="ep.title" :createdAt="ep.createdAt" />
            <div v-if="ep.number === number"
              class="currenttext absolute top-0 right-0 left-0 bottom-0 bg-[#000000b0] font-bold text-5xl">Current<br /><br />‎
            </div>
          </div>
        </nuxt-link>
      </div>
    </arrows>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, nextTick, onMounted, ref, watch, watchEffect } from '#imports';
import { navigateTo, useFetch, useHead, useRoute, useRuntimeConfig } from '#app';
import { createError } from 'h3';
import { gettitle } from 'assets/ts/helpers';
const runtimeConfig = useRuntimeConfig();

const route = useRoute();
const episodeRefs = ref([]);

const url = `${route.params.animeslug}/${route.params.episodenum}`;

definePageMeta({
  key: route => {
    return `/${route.params.animeslug}/${route.params.episodenum}`;
  },
  // middleware: "auth"
});

const { error, data: episode } = await useFetch<{
  id: string,
  description: string | undefined,
  number: number,
  anime: {
    title: {
      english: string | undefined,
      romaji: string | undefined,
      native: string | undefined,
      userPreferred: string | undefined
    },
    slug: string,
    episodes: {
      number: number,
      sources: object[]
    }[],
    bannerImage: string | undefined,
    coverImage: string | undefined,
    color: string | undefined
  },
  title: string | undefined,
  sources: object[],
  image: string | undefined,
  createdAt: Date | undefined
}>(`${runtimeConfig.public.enimeApi}/view/${url}`, {
  key: url
});

if (error.value || !episode.value) {
  throw createError({ statusCode: 404, message: "Episode not found" })
}

const { id, description, number, anime, title, sources, image, createdAt } = episode.value;
const animeeps = anime.episodes.sort((a, b) => a.number - b.number);
const preferredTitle = gettitle(anime.title);

useHead({
  title: `Episode ${number}${title ? ` - ${title}` : ""} | ${preferredTitle} | Enime`,
  meta: [
    {
      name: "og:title",
      content: `${preferredTitle} Episode ${number}`
    },
    {
      name: "og:type",
      content: "website"
    },
    {
      name: "og:url",
      content: `https://enime.moe/watch/${anime.slug}/${number}`
    },
    {
      name: "og:image",
      content: image || anime.bannerImage || anime.coverImage
    },
    {
      name: "og:description",
      content: `Watch ${preferredTitle} Episode ${number}${title ? ` - ${title}` : ""} online on Enime ${description ? `\n${description}` : ""}`
    },
    {
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      name: "theme-color",
      content: anime.color
    }
  ]
});

onMounted(() => {
  if (episodeRefs.value && number > 0 && number <= episodeRefs.value.length) {
    const current = episodeRefs.value[number - 1];
    if (current) current.$el.scrollIntoView({ behavior: "auto", block: "nearest" })
  }
})
</script>

<style scoped lang="scss">
.cont {
  padding: 0 10vw;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  aspect-ratio: 2/.8;
}

.episode {
  flex: 1;
}

.next-eps::-webkit-scrollbar-track {
  background-color: transparent;
}

.cur {
  background-color: #333;
  border-radius: 5px;
  color: #eee;
}
// .cur::after {
//   position: absolute;
//   width: 200px;
//   height: 200px;
//   background-color: inset 0 0 50px 50px #ff0000b0;
//   content: "";
// }
.currenttext {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 25px;
}
.line {
  width: 100%;
  flex-basis: 1px;
  height: 100000px;
  background-color: #333;
}

.next-ep {
  white-space: normal;
  line-height: 1.75rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.next-ep>p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}
</style>
