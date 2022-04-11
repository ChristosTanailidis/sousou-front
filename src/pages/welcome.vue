<template>
  <div class="w-full p-2">
    <div class="flex flex-col no-wrap items-center w-full">
      <div
        class="text-4xl"
        dark="text-gray-300"
      >
        Welcome 👋
      </div>
      <div>
        <login v-if="loginPage" />
        <register v-else />
      </div>
      <div>
        <div v-if="loginPage">
          Not a member? Become one here!
        </div>
        <div v-else>
          Already a member? Login in here!
        </div>
        <button
          @click="loginPage = !loginPage"
        >
          {{ loginPage ? 'Sign Up' : 'Login' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Login from '~/components/welcome/login.vue'
import Register from '~/components/welcome/register.vue'

const loginPage = ref(true)
</script>

<route lang="yaml">
meta:
  layout: welcome
</route>
