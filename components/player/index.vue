<template>
  <div id="player" class="w-full h-full p-0 m-0" ref="playerContainerRef"></div>
</template>

<script setup lang="ts">
import Player from '@oplayer/core';
import ui from '@oplayer/ui';
import hls from '@oplayer/hls';

import { useFetch, useNuxtApp, useRuntimeConfig } from '#app';
import { nextTick, onBeforeUnmount, ref } from 'vue';
import { onMounted, watch } from '#imports';

const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  episode: Object,
  sources: Array,
  anime: Object
});

const instanceRef = ref(null);
const playerContainerRef = ref(null);

let currentSourceIndex = ref(0);
let source = props.sources[currentSourceIndex.value];

let { data: sourceRef } = await useFetch(`${runtimeConfig.public.enimeApi}/source/${source.id}`, {
  key: `source-${source.id}`
});

const posterRaw = props.episode.image || props.anime.bannerImage || props.anime.coverImage;
const poster = `https://images.weserv.nl/?url=${posterRaw}`;

onMounted(() => {
  const player = Player.make(playerContainerRef.value, {
    source: {
      src: sourceRef.value.url,
      poster: poster
    }
  })
      .use([hls({
        options: {
          hlsQualityControl: true,
          hlsQualitySwitch: "immediate"
        }
      }), ui({
        fullscreenWeb: false,
        subtitle: {
          source: sourceRef.value.subtitle ? [
            {
              default: true,
              src: sourceRef.value.subtitle
            }
          ] : [],
          fontSize: 30,
          enabled: true
        }
      })])
      .create();

  player.on(["pluginerror", "error"], async (event) => {
    const fatal = event?.payload?.fatal;

    if (fatal) {
      if (currentSourceIndex.value < props.sources.length) {
        currentSourceIndex.value++;
        source = props.sources[currentSourceIndex.value];

        let { data: sourceRef } = await useFetch(`${runtimeConfig.public.enimeApi}/source/${source.id}`, {
          key: `source-${source.id}`
        });

        await player.changeSource({
          src: sourceRef.value.url,
          poster: poster
        });

        if (sourceRef.value.subtitle) player.emit("subtitlechange", [
          {
            default: true,
            src: sourceRef.value.subtitle,
            name: "English"
          }
        ]);
      }
    }
  });

  instanceRef.value = player;
});
</script>
<script>

</script>

<style>

</style>