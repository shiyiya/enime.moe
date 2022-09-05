<template>
  <div class="bg-black text-white h-screen w-screen flex flex-col">
    <div class="nav-cont">
      <div class="opts flex items-center gap-8 h-full mx-auto relative" ref="opts">
        <nuxt-link to="/" class="navbar-opt text-4xl">Explore</nuxt-link>
        <div class="grid w-40" v-if="old">
          <div class="urmom text-4xl flex flex-row flex-nowrap items-center px-2">
            <svg width="1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="searchtext pl-1">Search</span>
          </div>
          <input @keyup.enter="search" ref="search" placeholder=" " class="urmom in p-2 text-4xl w-70" />
        </div>
        <div class="urmom navbar-opt text-4xl flex flex-row flex-nowrap items-center px-2" v-else @click="searchbar">
          <svg width="1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="searchtext pl-1">Search</span>
        </div>
      </div>
      <div ref="searchbar" class="m-auto hidden bruh">
        <input @keyup.enter="search" @keyup="searchtype" ref="fullsearch" placeholder="Search"
          class="p-2 px-4 text-4xl w-full" />
        <div class="divider" ref="searchdivider" v-if="results.length || histresults.length"></div>
        <!-- <div class="text-tertiary ml-4 text-lg" v-if="histresults.length">HISTORY</div>
        <nuxt-link :to="`/search/${result.title.userPreferred}`" class="searchresultlink history"
          v-for="result in histresults" :key="result.id">
          <svg viewBox="0 0 20 20" class="w-6 h-6 ml-6 mr-10" fill="#999">
            <path fill-rule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
              clip-rule="evenodd" />
          </svg>
          <p class="searchresulttitle text-xl">{{ result.title.userPreferred }}</p>
        </nuxt-link>
        <div class="text-tertiary ml-4 text-lg" v-if="results.length">ANIME</div> -->
        <nuxt-link :to="`/anime/${result.slug}`" class="searchresultlink anime" v-for="result in results"
          :key="result.id">
          <div class="searchresultimg h-10 aspect-video bg-cover bg-center"
            :style="{ backgroundImage: `url(${result.coverImage})` }"></div>
          <div class="flex flex-col">
            <p class="searchresulttitle text-xl">
              {{ gettitle(result.title) }}
            </p>
            <p class="searchresultdesc text-sm text-tertiary">
              {{ result.currentEpisode }} Episodes
            </p>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div class="flex-grow w-screen p-0 m-0 mt-20">
      <slot />
    </div>
    <footer class="bg-[#222] py-10">
      <div class="foot-cont flex flex-row content-between mx-auto">
        <div class="disclaimer">
          <div class="flex flex-row items-center mb-3">
            <img src="/icons/64x64.png" class="w-6 mr-2" />
            <h1 class="text-2xl">Enime-Project</h1>
          </div>
          <p class="gray-text">ENIME.MOE is not affiliated with or endorsed by any of the anime studios behind
            the creation
            of the anime presented on this site. This website is only an user interface presenting/linking various
            self-hosted
            files
            across the internet by other third-party providers for easy access.
            <br />
            © ENIME.MOE {{ new Date().getFullYear() }} | Built with <a
              href="https://github.com/Enime-Project/api.enime.moe" target="_blank" class="text-tertiary">Enime API</a>
          </p>
        </div>
        <div class="flex-1 flex items-center justify-end">
          <a target="_blank" href="https://github.com/Enime-Project/enime.moe"><img class="h-7 mr-5"
              src="/icons/github.png" /></a>
          <a target="_blank" href="https://discord.gg/nxr8be8WGa"><img class="w-7" src="/icons/discord.png" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  const old = false;
  // onMounted(() => {
  //   pastsearches.value = (JSON.parse(localStorage.getItem("history")) || []).concat([ "one", "once", "hone" ]);
  //   console.log(pastsearches.value);
  // })
</script>

<script lang="ts">
import { nextTick, ref, onMounted } from "#imports";
import { navigateTo } from "#app";
import { gettitle } from "../assets/ts/helpers";
let results = ref([]);
// let histresults = ref([]);
// let pastsearches = ref([]);
let fn, fn2;
let timeout;
export default {
  name: "default",
  methods: {
    search(e) {
      let search = e.target.value.trim();
      clearTimeout(timeout);
      results.value = [];
      e.target.value = "";
      fn({ target: document.body });
      if(search.length > 1)
        navigateTo(`/search/${search}`);
    },
    searchtype(e) {
      document.removeEventListener("click", fn);
      document.removeEventListener("click", fn2);
      document.addEventListener("click", fn2 = function(event) {
        if (event.target?.classList?.contains?.("searchtext") || event.target?.classList?.contains?.("bruh") || event.target?.parentElement?.classList?.contains?.("bruh") || event.target?.parentElement?.parentElement?.classList?.contains?.("bruh")){
          return;
        }
        results.value = [];
        // histresults.value = [];
      });
      if(!e.target.value) document.addEventListener("click", fn);
      // if(e.target.value)
      //   histresults.value = pastsearches.value.filter(s => s.includes(e.target.value)).map(s => {
      //     return {
      //       title: {
      //         userPreferred: s, english: s
      //       }
      //     }
      //   });
      //else histresults.value = pastsearches.value;
      if(timeout) { clearTimeout(timeout); timeout = 0; }
      if(e.target.value.length < 2) {
        results.value = [];
        return;
      }
      timeout = setTimeout(async () => {
        results.value = (await (await fetch(`https://api.enime.moe/search/` + e.target.value)).json()).data.slice(0, 10);
        console.log(results.value);
      }, 1000);
    },
    async searchbar(e) {
      const sb = this.$refs.searchbar;
      const fs = this.$refs.fullsearch;
      const opts = this.$refs.opts;
      
      opts.classList.add("hidden");
      sb.classList.remove("hidden");
      await nextTick();
      fs.focus();
      document.addEventListener("click", fn = function (event) {
        // console.log("???", event.target, this);
        if (event.target?.classList?.contains?.("searchtext") || event.target?.classList?.contains?.("bruh") || event.target?.parentElement?.classList?.contains?.("bruh") || event.target?.parentElement?.parentElement?.classList?.contains?.("bruh")) return;
        document.removeEventListener("click", fn);
        fs.value = "";
        sb.classList.add("hidden");
        opts.classList.remove("hidden");
      });
    }
  }
}
</script>

<style scoped lang="scss">
  .foot-cont {
    margin: 0 10vw;
  }
  .nav-cont {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 100;
    height: 5rem;
    width: 100%;
    background-color: black;

    display: flex;
    flex-direction: column;
    justify-items: center;
  }
  .opts {
    color: #aaa;
  }
  .urmom { // Specifically the search text on navbar, the symbol and the input
    grid-column: 1;
    grid-row: 1;
  }
  .navbar-opt {
    &:hover {
      color: #ffffff;
    }
  }
  .searchresult {
    &img {
      margin-right: 1rem;
      border-radius: 5px;
    }
    &link {
      display: flex;
      flex-direction: row;
      align-items: center;
      &:hover {
        background-color: #333;
      }
      &.history {
        color: white;
        padding: .3rem 1rem;
      }
      &.anime {
        padding: .7rem 1rem;
      }
    }
    &title {
      color: #aaa;
    }
  }
  .bruh { // searchbar
    background-color: #171717;
    border-radius: .6rem;
    border: 1px solid #282828;
    width: calc(20rem + 40vw);
    z-index: 10000;
    // overflow: hidden;
    .divider {
      margin-bottom: .5rem;
      border: 1px solid #252525;
    }
    input {
      font-weight: 500;
      margin: .5rem;
      background-color: transparent;
      &::placeholder {
        color: #555;
      }
      &:focus {
        outline: none;
      }
    }
  }
  .in {
    background-color: transparent; /* #fff3; */
    border-radius: .6rem;

    &:not(:placeholder-shown) {
      background-color: black;
      border: 3px solid #333;
    }
    &:focus {
      border: 3px solid #999;
      outline: none;
    }
  }
  .disclaimer {
    flex: 3;
  }
  .gray-text {
    color: #ccc;
  }

  @media screen and (max-width: 768px) {
    .bruh {
      width: 80vw;
      input {
        width: 80vw;
      }
    }
  }
</style>