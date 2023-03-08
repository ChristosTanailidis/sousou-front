<template>
  <div class="h-full w-full flex flex-col items-center justify-center">
    <q-img
      src="/assets/sousou_logo_primary.svg"
      spinner-color="primary"
      object="contain"
      width="40rem"
      class="animate__animated animate__fadeIn bounce"
    />
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

.bounce:nth-child(2n) {
  animation-delay: 5s;
}
</style>
