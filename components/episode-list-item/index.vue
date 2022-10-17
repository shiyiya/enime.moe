<template>
  <div>
    <div :style="{ backgroundImage: `url(${image ? 'https://images.weserv.nl/?url=' + image : anime.coverImage})` }" class="epimage w-full aspect-video bg-center bg-cover">
    </div>
    <p class="eptext text-overflow">Episode {{ number }}<span v-if="title">: {{
        title
    }}</span></p>
    <p class="text-tertiary text-[0.875rem] mb-1 m-0">Released {{ ago }}</p>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from '#imports';

const e = defineProps<{
  airedAt: null | string;
  createdAt: any;
  number: string | number;
  title: null | string;
  image: null | string;
  anime: {
    coverImage: string;
  };
}>();

const { anime, airedAt, createdAt } = toRefs(e);

let dateused = airedAt.value || createdAt.value,
    passed = Date.now() - Date.parse(dateused);
let ago: any = " " + new Date(dateused).toLocaleDateString("en-US").replaceAll(" ", "");
let str = "";
if (passed < 3 * 31536000000) {
  if (passed > 31536000000) // 1 year in time
    ago = Math.round(passed / 31536000000),
    str = " year";
  else if (passed > 2592000000) // 1 month in time
    ago = Math.round(passed / 2592000000),
    str = " month";
  else if (passed > 604800000)
    ago = Math.round(passed / 604800000),
    str = " week";
  else if (passed > 86400000) // .. and so on
    ago = Math.round(passed / 86400000),
    str = " day";
  else if (passed > 3600000)
    ago = Math.round(passed / 3600000),
    str = " hour";
  else if (passed > 60000)
    ago = Math.round(passed / 60000),
    str = " minute";
  else ago = Math.round(passed / 1000), str = " second";
  if (ago > 1) str += "s";
  ago += str + " ago";
}
</script>

<style>
.epimage {
  /*box-shadow: inset 0 -5rem 5rem rgba(0, 0, 0, .8);*/
  border-radius: 5px;
}

.eptext {
  margin: 0;
  margin-top: .5rem;
  /* margin-bottom: .3rem; */
  font-size: 1.1rem;
  line-height: 1.3;
}
</style>