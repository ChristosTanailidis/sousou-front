<template>
  <q-expansion-item
    expand-icon="none"
    header-class="bg-dark-400"
  >
    <q-list
      :separator="separateItems"
      :style="{
        maxHeight: `calc(100vh - ( 250px + ${headerRef ? headerRef.clientHeight : '0px'} ))`,
        overflowY: 'auto'
      }"
      class="bg-dark-300"
    >
      <slot />
    </q-list>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// components

// models

// stores

// utils

export default defineComponent({
  props: {
    headerRef: {
      type: Object as PropType<Element>,
      default: undefined
    },
    separateItems: {
      type: Boolean,
      default: false
    }
  },
  emits: [],
  setup () {
    return {

    }
  }
})
</script>
