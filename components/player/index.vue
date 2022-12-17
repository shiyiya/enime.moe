<template>
  <div id="player" class="w-full h-full p-0 m-0" ref="playerContainerRef"></div>
</template>

<script setup lang="ts">
import Player from '@oplayer/core';
import ui from '@oplayer/ui';
import hls from '@oplayer/hls';

import { useFetch, useNuxtApp, useRuntimeConfig } from '#app';
import { nextTick, onBeforeUnmount, PropType, ref } from 'vue';
import { onMounted, watch } from '#imports';

const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  episode: Object,
  sources: Array as PropType<{
    id: String,
    url: String
  }[]>,
  anime: Object
});

let instanceRef = undefined;
const playerContainerRef = ref(null);

let currentSourceIndex = ref(0);
let source = props.sources[currentSourceIndex.value];

let { data: sourceRef } = await useFetch<{
  url: string,
  subtitle?: string
}>(`${runtimeConfig.public.enimeApi}/source/${source.id}`, {
  key: `source-${source.id}`
});

const posterRaw = props.episode.image;
const poster = !posterRaw ? undefined : `https://images.weserv.nl/?url=${posterRaw}`;

onMounted(() => {
  console.log("ASD")
  const player = Player.make(playerContainerRef.value, {
    source: {
      src: sourceRef.value.website === "https://zoro.to" ? `https://cors.proxy.consumet.org/${sourceRef.value.url}` : sourceRef.value.url,
      ...(!!poster && {
        poster: poster
      })
    }
  })
      .use([ui({
        subtitle: {
          source: sourceRef.value.subtitle ? [
            {
              default: true,
              src: sourceRef.value.subtitle
            }
          ] : [],
          fontSize: 30,
          enabled: true
        },
        menu: [
          {
            name: "Source",
            children: props.sources.map(source => {
              return {
                name: source.url.includes("gogoanime") ? "Gogoanime" : "Zoro",
                default: source.url.includes("gogoanime"),
                value: source.id
              }
            }),
            onChange({ value }) {
              changeSource(value);
            },
            onClick() {

            }
          }
        ]
      }), hls({
        options: {
          hlsQualityControl: true,
          hlsQualitySwitch: "immediate"
        }
      })])
      .create();

  const changeSource = async (sourceId) => {
    let { data: sourceRef } = await useFetch<{
      url: string,
      subtitle?: string
    }>(`${runtimeConfig.public.enimeApi}/source/${sourceId}`, {
      key: `source-${sourceId}`
    });

    await player.changeSource({
      src: sourceRef.value.url,
      ...(!!poster && {
        poster: poster
      })
    });

    console.log(sourceRef.value)
    if (sourceRef.value.subtitle) player.emit("subtitlechange", [
      {
        default: true,
        src: sourceRef.value.subtitle,
        name: "English"
      }
    ]);
  }

  player.on(["pluginerror", "error"], async (event) => {
    const fatal = event?.payload?.fatal;

    if (fatal) {
      if (currentSourceIndex.value < props.sources.length) {
        currentSourceIndex.value++;
        source = props.sources[currentSourceIndex.value];

        await changeSource(source.id);
      }
    }
  });

  instanceRef = player;
});

onBeforeUnmount(() => {
  if (instanceRef) instanceRef.destroy();
});
</script>
<script>

</script>

<style>

</style>