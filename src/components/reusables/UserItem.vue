<template>
  <q-item
    clickable
    :disabled="user?.pending"
    class="my-2 rounded overflow-hidden"
  >
    <q-item-section
      top
      avatar
    >
      <q-avatar
        color="primary"
        size="40px"
      >
        <q-img
          :src="user.icon"
          object="cover"
        />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ user.displayName }} {{ user.pending ? '(pending invite)' : '' }}</q-item-label>
      <q-item-label
        v-if="code"
        caption
        lines="2"
      >
        #{{ user.code }}
      </q-item-label>
    </q-item-section>

    <q-item-section
      v-if="groupsIndicator"
      side
      top
    >
      <q-item-label caption>
        In {{ groups.length }} groups
      </q-item-label>

      <q-item-section
        class="relative w-full h-full"
      >
        <q-avatar
          v-for="(group, i) in groups"
          :key="group.id"
          size="20px"
          class="absolute"
          :style="`right: ${i * 17}px`"
        >
          <q-img
            :src="group.icon"
            class="w-full h-full"
            fit="cover"
          />
        </q-avatar>
      </q-item-section>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'

// components

// models
import { UserToAdd } from 'src/models/User'
import { Group } from 'src/models/Group'

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    user: {
      type: Object as PropType<UserToAdd>,
      required: true
    },
    code: {
      type: Boolean,
      default: false
    },
    groupsIndicator: {
      type: Boolean,
      default: false
    }
  },
  emits: [],
  setup (props) {
    return {
      groups: computed(() => {
        if (!props.user.groups) {
          return [] as Group[]
        } else {
          return props.user.groups.filter((g, i) => i < 2)
        }
      })
    }
  }
})
</script>
