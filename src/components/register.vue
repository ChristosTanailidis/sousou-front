<template>
  <div>
    <div>
      <!-- <FormulateInput type="text" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { notify as vNotify } from '@kyvg/vue3-notification'

onMounted(() => {
  vNotify({
    type: 'error',
    title: 'test',
  })
})

</script>
