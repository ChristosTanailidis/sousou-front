<template>
  <div class="container ">
    <div class="flex flex-row flex-nowrap h-full overflow-hidden">
      <div class="w-[50%] flex items-center justify-center">
        <div class="z-50">
          <q-img
            src="/assets/sousou_logo_RGB.svg"
            spinner-color="primary"
            object="contain"
            class="w-[20rem]"
          />
        </div>
      </div>

      <div class="w-[50%] flex items-center justify-center">
        <div class="z-50 relative">
          <router-view v-slot="{ Component }">
            <transition>
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>

    <div class="slider-thumb-1 z-0" />
    <div class="slider-thumb-2 z-0" />
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
.v-enter-active, .v-leave-active,
.forgot-password-enter-active, .forgot-password-leave-active {
  transform: translateY(0px);
  transition: all 0.5s ease;
}

.v-enter-from, .v-leave-to,
.forgot-password-enter-from, .forgot-password-leave-to {
  position: absolute;
  opacity: 0;
}

.v-enter-active {
  transition-delay: 0.25s;
}

.forgot-password-enter-active {
  transition-delay: 1.5s;
}

.v-leave-to, .v-enter-from,
.forgot-password-leave-to, .forgot-password-enter-from {
  transform: translateY(1rem);
}

.container {
  width: 100vw;
  height: 100vh;
  z-index: -5;
}

.slider-thumb-1::before {
  position: absolute;
  content: "";
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto 10rem auto auto;
  width: 40vw;
  min-width: 400px;
  height: 40vw;
  min-height: 400px;
  background: #17141d;
  border-radius: 62% 47% 82% 35% / 45% 45% 80% 66%;
  display: block;
  will-change: border-radius, transform, opacity;
  animation: sliderShape 10s linear infinite;
  -webkit-animation: sliderShape 10s linear infinite;
}

.slider-thumb-2::before {
  position: absolute;
  content: "";
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 5rem 5rem auto auto;
  width: 15vw;
  min-width: 150px;
  height: 15vw;
  min-height: 150px;
  background: #17141d;
  border-radius: 62% 47% 82% 35% / 45% 45% 80% 66%;
  display: block;
  rotate: 45deg;
  will-change: border-radius, transform, opacity;
  animation: sliderShape 15s linear infinite;
  -webkit-animation: sliderShape 15s linear infinite;
}

@keyframes sliderShape {
  0%,100%{
  border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
    transform: translate3d(0,0,0) rotateZ(0.01deg);
  }
  25%{
      border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%;
    transform:  translate3d(0,5px,0) rotateZ(0.01deg);
  }
  50%{
    transform: translate3d(0,0,0) rotateZ(0.01deg);
  }
  75%{
    border-radius: 100% 60% 60% 100% / 100% 100% 60% 60% ;
    transform: translate3d(0,-3px,0) rotateZ(0.01deg);
  }
}

</style>
