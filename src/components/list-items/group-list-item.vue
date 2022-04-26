<template>
  <!-- <div
    class="flex flex-row items-center no-wrap gap-x-2 p-2 justify-start bg-gray-300 rounded-md h-18 w-full"
    :class="props.miniState ? 'justify-center' : 'justify-start'"
    :md="props.miniState ? 'h-18' : 'h-20'"
    dark="bg-dark-base-3"
  >
    <div
      class="rounded-full w-12 h-12 bg-blue-200 flex items-center justify-center text-gray-700 text-2xl font-bold overflow-hidden"
      md="w-14 h-14"
    >
      G{{ group.icon }}
    </div>
    <div
      v-if="!props.miniState"
      class="flex flex-col no-wrap hidden"
      md="block"
    >
      <div>{{ group.name }}</div>
      <div>tag</div>
      <div>something else</div>
    </div>
    <div
      v-if="!props.miniState"
      class="hidden"
      md="block"
    >
      hi
    </div>
  </div> -->
  <div
    class="group-list-item justify-center"
  >
    <div
      class="avatar-rounded"
      :class="`bg-hex-[${group.color}]`"
    >
      <!-- todo: this will become the src of an img -->
      <div>
        {{ group.icon }}
      </div>
    </div>
    <div
      v-if="!props.miniState"
      class="text-lg font-bold flex-grow hidden"
      md="block"
    >
      {{ group.name }}
    </div>
    <div
      v-if="!props.miniState"
      :class="`!bg-hex-[${group.color}]`"
      class="h-full w-[10px] hidden "
      md="block"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// interfaces
import type Group from '~/assets/entities/group'

// components

// stores

// utils

// const emits = defineEmits([])

const props = defineProps({
  value: {
    type: Object as PropType<Group>,
    required: true,
  },
  miniState: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const group = computed((): Group => props.value)

</script>
