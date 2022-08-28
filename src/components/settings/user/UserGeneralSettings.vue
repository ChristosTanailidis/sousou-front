<template>
  <q-card flat>
    <q-form
      class="w-[75%]"
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-card-section class="flex flex-col flex-nowrap gap-2">
        User General Settings here
      </q-card-section>

      <q-card-actions class="flex gap-1">
        <q-btn
          unelevated
          icon="save"
          label="save"
          color="primary"
          class="flex-grow"
          type="submit"
        />
        <q-btn
          unelevated
          color="secondary"
          label="Reset"
          icon="restart_alt"
          type="reset"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// components

// models

// stores
import notify from 'src/utils/notify'
// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    const onSubmit = async () => {
      notify('success', 'Saved')
    }
    return {
      onSubmit,
      onReset: () => undefined
    }
  }
})
</script>
