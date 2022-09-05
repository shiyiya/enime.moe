<template>
  <div id="player" class="w-full h-full p-0 m-0" ref="artRef"></div>
</template>

<script setup lang="ts">
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useFetch, useNuxtApp, useRuntimeConfig } from '#app';
import { nextTick, onBeforeUnmount, ref } from 'vue';
import { onMounted } from '#imports';
// @ts-ignore
import escapeHtml from 'escape-html-whitelist';

const runtimeConfig = useRuntimeConfig();
const emits = defineEmits(["get-instance"]);
const { $device } = useNuxtApp();

const props = defineProps({
  episode: Object,
  sources: Array,
  anime: Object
});

const artRef = ref(null);
const instanceRef = ref(null);

const options = {
  ssr: true,
  autoSize: true,
  miniProgressBar: true,
  screenshot: true,
  mutex: true,
  setting: false,
  backdrop: true,
  volume: 0.5,
  hotkey: true,
  type: "m3u8",
  playsInline: true,
  whitelist: ["*"],
  contextmenu: [],
  moreVideoAttr: {
    crossOrigin: 'anonymous',
    preload: "none",
    playsInline: true,
    "webkit-playsinline": true
  },
  poster: props.episode.image || props.anime.bannerImage || props.anime.coverImage,
}

if ($device.isDesktop) options.fullscreen = true;
else options.fullscreenWeb = true;

let currentSourceIndex = ref(0);
let source = props.sources[currentSourceIndex.value];

let { data: sourceRef } = await useFetch(`${runtimeConfig.public.enimeApi}/source/${source.id}`, {
  key: `source-${source.id}`
});

onMounted(() => {
  artRef.value.style.zIndex = "9999999999999999999 !important;";

  Artplayer.TOUCH_MOVE_RATIO = 1.0;

  instanceRef.value = new Artplayer({
    ...options,
    id: `${props.anime.slug}-${props.episode.number}`,
    url: sourceRef.value.url,
    container: artRef.value,
    autoMini: true,
    ...(sourceRef.value.subtitle && {
      subtitle: {
        url: sourceRef.value.subtitle,
        type: "vtt",
        encoding: "UTF-8",
        style: {
          "font-size": "2vw",
          "margin-bottom": "1.5rem"
        }
      }
    }),
    customType: {
      m3u8: function (video, url, art: Artplayer & { hls: Hls }) {
        if (art.hls) {
          art.hls.destroy();
          art.hls = null;
        }

        if (Hls.isSupported()) {
          art.hls = new Hls({
            debug: false
          });
          art.hls.on("hlsError", async ({ type, details, fatal }) => {
            if (!fatal) return;

            if (currentSourceIndex.value < props.sources.length) {
              currentSourceIndex.value++;
              source = props.sources[currentSourceIndex.value];

              let { data: sourceRef } = await useFetch(`${runtimeConfig.public.enimeApi}/source/${source.id}`, {
                key: `source-${source.id}`
              });

              if (sourceRef.value.subtitle) await art.subtitle.switch(sourceRef.value.subtitle, {
                type: "vtt",
                encoding: "UTF-8",
                style: {
                  "font-size": "2vw",
                  "margin-bottom": "1.5rem"
                }
              })
              await art.switchUrl(sourceRef.value.url)
            }
          });
          art.hls.loadSource(url);
          art.hls.attachMedia(video);
        } else {
          const canPlay = video.canPlayType("application/vnd.apple.mpegurl");
          if (canPlay === "probably" || canPlay === "maybe") {
            video.src = url;
          } else {
            instance.notice.show = "Unsupported media type: m3u8";
          }
        }
      },
    },
  });

  let instance = instanceRef.value;

  nextTick(() => {
    emits("get-instance", instance);
  });

  instance.on('subtitleUpdate', text => {
    instance.template.$subtitle.innerHTML = `<p>${escapeHtml(text)}</p>`;
  })

  instance.on("destroy", () => {
    if (instance.hls) {
      instance.hls.destroy();
      instance.hls = null;
    }
  });

  instance.on("ready", () => {
    instance.controls.add(
        {
          position: "right",
          html: "Auto",
          width: 200,
          selector: [...instance.hls.levels.filter(item => item.height && item.height !== 0).map((item, _) => {
            return {
              html: item.height + 'P',
              level: _
            }
          }), {
            default: true,
            html: "Auto",
            level: -1
          }],
          onSelect(item) {
            instance.hls.nextLevel = item.level;
            return item.html;
          },
          mounted() {
            const $value = instance.query(".art-control-hls_levels .art-selector-value");

            function updateHtml() {
              const currentLevel = instance.hls.levels[instance.hls.currentLevel];
              if (currentLevel && $value) {
                if (instance.hls.currentLevel === -1) $value.innerHTML = "Auto";
                else if (currentLevel.height !== 0) $value.innerHTML = currentLevel.height + "P";
              }
            }

            instance.hls.once(Hls.Events.LEVEL_SWITCHING, (level) => {
              updateHtml();
            });

            instance.hls.once(Hls.Events.LEVEL_SWITCHED, (level) => {
              updateHtml();
            });

            instance.hls.once(Hls.Events.LEVEL_LOADING, (level) => {
              updateHtml();
            });

            instance.hls.once(Hls.Events.LEVEL_LOADED, (level) => {
              updateHtml();
            });

            instance.hls.once(Hls.Events.LEVEL_UPDATED, (level) => {
              updateHtml();
            });

            instance.hls.once(Hls.Events.LEVELS_UPDATED, (level) => {
              updateHtml();
            });
          }
        }
    )

    if(localStorage.getItem('artplayer-volume-' + window.location.pathname))
      instance.volume = localStorage.getItem('artplayer-volume-' + window.location.pathname);
    if (localStorage.getItem('artplayer-curtime-' + window.location.pathname)) instance.currentTime = localStorage.getItem('artplayer-curtime-' + window.location.pathname)

    const settime = () => {
      localStorage.setItem('artplayer-curtime-' + window.location.pathname, instance.currentTime);
    };
    let int = setInterval(settime, 5000);
    instance.on("pause", () => clearInterval(int))
        .on("play", () => { settime(); int = setInterval(settime, 5000); })
        .on("destroy", () => clearInterval(int))
        .on("seek", () => { settime(); clearInterval(int); int = setInterval(settime, 5000); })
        .on("volume", () => { localStorage.setItem('artplayer-volume-' + window.location.pathname, instance.volume); })
  });
});

onBeforeUnmount(() => {
  if (instanceRef.value && instanceRef.value.destroy) {
    instanceRef.value.destroy();
  }
})
</script>
<script>

</script>

<style>

</style>