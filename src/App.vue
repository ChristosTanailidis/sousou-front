<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import 'animate.css'

export default defineComponent({
  name: 'App',
  setup: () => {
    const $q = useQuasar()
    $q.dark.set(true)
  }
})
</script>
