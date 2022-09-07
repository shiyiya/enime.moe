<template>
  <div id="player" class="w-full h-full p-0 m-0" ref="playerContainerRef"></div>
</template>

<script setup lang="ts">
import Player from '@oplayer/core';
import PlayerUI from '@oplayer/ui';
import hls from '@oplayer/hls';

import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useFetch, useNuxtApp, useRuntimeConfig } from '#app';
import { nextTick, onBeforeUnmount, ref } from 'vue';
import { onMounted } from '#imports';
// @ts-ignore
import escapeHtml from 'escape-html-whitelist';

const runtimeConfig = useRuntimeConfig();
const emits = defineEmits(["get-instance"]);

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

onMounted(() => {
  const player = Player.make(playerContainerRef.value, {
    source: {
      src: sourceRef.value.url,
      poster: props.episode.image || props.anime.bannerImage || props.anime.coverImage
    }
  })
      .use([PlayerUI({
        ...(sourceRef.value.subtitle && {
          subtitle: {
            source: [
              {
                default: true,
                src: sourceRef.value.subtitle
              }
            ]
          }
        })
      }), hls()])
      .create();

  instanceRef.value = player;
});
</script>
<script>

</script>

<style>

</style>