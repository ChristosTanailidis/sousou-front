<template>
  <main
    class="h-full w-full overflow-hidden text-gray-700 relative flex items-center justify-center"
    dark="text-dark-content-1 bg-dark-base-1"
  >
    <div class="w-full p-2">
      <div class="flex flex-col no-wrap items-center w-full">
        <div
          class="text-4xl"
          dark="text-gray-300"
        >
          Welcome 👋
        </div>
        <div>
          <router-view class="z-20" />
        </div>
        <div>
          <div v-if="loginPage">
            Not a member? Become one here!
          </div>
          <div v-else>
            Already a member? Login in here!
          </div>
          <router-link
            :to="loginPage ? '/welcome/register' : '/welcome'"
          >
            {{ loginPage ? 'Sign Up' : 'Login' }}
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const router = useRouter()

const loginPage = computed(() => router.currentRoute.value.path === '/welcome')
</script>
