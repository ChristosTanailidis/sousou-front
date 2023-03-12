<template>
  <q-item
    clickable
    :disabled="user?.pending"
    class="my-2 rounded overflow-hidden"
  >
    <q-item-section
      top
      avatar
      class="relative"
    >
      <div
        v-if="notify"
        class="h-4 w-4 rounded-full bg-primary absolute top-0 right-3 z-40 border border-dark-300 animate__animated animate__headShake"
      >
        <Transition>
          <div
            v-if="typeof (notify) === 'number'"
            :key="notify"
            class="text-[0.7rem] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            {{ notify }}
          </div>
        </Transition>
      </div>

      <q-avatar
        color="primary"
        size="40px"
      >
        <UserImage
          :user="user"
        />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label
        lines="1"
      >
        {{ user.displayName }} {{ user.pending ? '(pending invite)' : '' }}
      </q-item-label>

      <q-item-label
        v-if="code"
        caption
        lines="1"
      >
        #{{ user.code }}
      </q-item-label>
      <q-item-label
        v-else-if="subText"
        caption
        lines="1"
      >
        {{ subText }}
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
import UserImage from 'src/components/reusables/UserImage.vue'

// models
import { UserToAdd } from 'src/models/User'
import { Group } from 'src/models/Group'

// stores

// utils

export default defineComponent({
  components: { UserImage },
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
    },
    subText: {
      type: String,
      default: undefined
    },
    notify: {
      type: [Boolean, Number],
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
