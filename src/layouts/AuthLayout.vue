<template>
  <div class="container">
    <div class="w-screen slider-thumb">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',
  components: { },
  setup () {
    return {
    }
  }
})
</script>

<style lang="css">
.container {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(90deg,var(--q-primary),var(--q-secondary));
}

.slider-thumb::before {
  position: absolute;
  content: "";
  left: 30%;
  top: 20%;
  width: 450px;
  height: 450px;
  background: #17141d;
  border-radius: 62% 47% 82% 35% / 45% 45% 80% 66%;
  will-change: border-radius, transform, opacity;
  animation: sliderShape-v-xxxxxxxx 5s linear infinite;
  display: block;
  z-index: -1;
  -webkit-animation: sliderShape-v-xxxxxxxx 5s linear infinite;
}

@keyframes sliderShape-v-xxxxxxxx{
  0%,100%{
  border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
    transform: translate3d(0,0,0) rotateZ(0.01deg);
  }
  34%{
      border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%;
    transform:  translate3d(0,5px,0) rotateZ(0.01deg);
  }
  50%{
    transform: translate3d(0,0,0) rotateZ(0.01deg);
  }
  67%{
    border-radius: 100% 60% 60% 100% / 100% 100% 60% 60% ;
    transform: translate3d(0,-3px,0) rotateZ(0.01deg);
  }
}

</style>
