<template>
  <Html>
    <Head>
      <Title>Enime</Title>
      <Script v-if="production" async src="https://arc.io/widget.min.js#ZGU5XFjQ"/>
      <Link rel="icon" href="/favicon.ico"/>
    </Head>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Html>
</template>
<script setup lang="ts">
import { useRuntimeConfig } from '#app';
const production = useRuntimeConfig().public.production;
</script>
<script lang="ts">
export default {
  name: "app"
}
</script>