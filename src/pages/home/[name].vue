<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const name = ref(user.savedName)
const router = useRouter()

</script>

<template>
  <div>
    aa{{ $router.currentRoute.value.params.name }}
  </div>
</template>

<route lang="yaml">

</route>
