<template>
  <q-menu touch-position>
    <q-list
      separator
      style="min-width: 100px"
    >
      <q-item
        v-close-popup
        clickable
      >
        <q-item-section>Add Friend</q-item-section>
      </q-item>
      <q-item
        v-close-popup
        clickable
      >
        <q-item-section>View Profile</q-item-section>
      </q-item>
      <q-item
        v-close-popup
        clickable
      >
        <q-item-section>more...</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// components

// models

// stores

// utils

export default defineComponent({
  setup () {
    return {

    }
  }
})
</script>
