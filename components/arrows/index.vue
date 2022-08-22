<template>
  <div ref="parent" class="flex flex-row items-center mt-6 left-0 right-0 m-0 p-0 w-full mb-20">
    <div ref="sleft" @click="scrollLeft" class="button left p-0 w-10 h-10">
      <left-arrow class="leftarrow" color="#ffF" />
    </div>
    <slot />
    <div ref="sright" @click="scrollRight" class="button right p-0 w-10 h-10">
      <left-arrow class="leftarrow" color="#ffF" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftArrow from '@/components/icon/leftarrow.vue';


const parent = ref(null);
const slots = ref(null);

function sc(e: Element, s: number): number {
  e.scrollTo({
    left: e.scrollLeft + s * window.innerWidth,
    behavior: 'smooth'
  });
  return e.scrollLeft + s * window.innerWidth;
}

function scrollLeft() {
  sc(slots.value as HTMLElement, -1);
}
function scrollRight() {
  sc(slots.value as HTMLElement, 1);
}

onMounted(() => {
  slots.value = parent.value.children[1];
});
</script>
  
<style scoped>

.leftarrow {
  color: #fff;
  width: 1.5rem;
  height: 1.5rem;
}

.button {
  position: absolute;
  cursor: pointer;
  margin: 5px;
  border-radius: 50%;
  box-shadow: 0px 0px 2px rgb(0, 0, 0);
  background-color: #000;
  border: solid 1px #333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.button:hover {
  transition: background-color 0.2s linear;
  background-color: #333;
}

.left {
  left: 0;
  transform: scaleX(-1);
}

.right {
  right: 0;
}
</style>