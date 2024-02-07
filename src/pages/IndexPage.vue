<template>
  <div class="h-full w-full flex flex-col items-center justify-center">
    <div>
      <q-img
        src="/assets/sousou_logo_white.svg"
        spinner-color="primary"
        object="contain"
        width="40rem"
        class="animate__animated animate__fadeIn bounce opacity-80"
      />
    </div>

    <div class="animate__animated animate__fadeIn shadow bg-[rgba(255,255,255,0.2)] w-90 h-2 rounded-[100%]" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// components

// models

// stores

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    return {

    }
  }
})
</script>

<style>
.bounce {
  animation-name: bounce;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes shadow {
  0% {
    transform: scale(127%);
  }
  50% {
    transform: scale(130%);
  }
  100% {
    transform: scale(127%);
  }
}

.bounce:nth-child(2n) {
  animation-delay: 5s;
}
</style>
