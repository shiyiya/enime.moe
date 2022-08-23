<template>
  <Html>
    <Head>
      <Title>Enime</Title>
      <Script v-if="production" async src="https://arc.io/widget.min.js#ZGU5XFjQ"/>
      <Link rel="icon" href="/favicon.ico"/>
    </Head>

    <NuxtLayout>
      <NuxtLoadingIndicator color="white" :height="2" />
      <NuxtPage />
    </NuxtLayout>
  </Html>
</template>
<script setup lang="ts">
import { useRuntimeConfig } from '#app';
import { onMounted } from 'vue';

const production = useRuntimeConfig().public.production;

onMounted(() => {
  if (production) {
    import('arrive').then(() => {
      document.arrive("#arc-widget-container", () => {
        document.getElementById("arc-widget-container").style.setProperty("z-index", "999", "important");
      })
    });
    document.getElementById("arc-widget-container")?.style?.setProperty("z-index", "999", "important");
  }
});
</script>
<script lang="ts">
export default {
  name: "app"
}
</script>
<style>
#arc-widget-container {
  z-index: 999 !important;
}
</style>