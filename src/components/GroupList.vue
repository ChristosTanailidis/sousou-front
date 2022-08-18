<template>
  <q-list
    class="rounded"
  >
    <q-item class="flex flex-col gap-2 p-2">
      <q-btn
        flat
        no-caps
        color="primary"
        icon="add"
        label="Create a group"
        class="w-full"
        @click="openCreateGroup"
      />
      <q-input
        v-model="search"
        dense
        borderless
        rounded
        debounce="750"
        type="search"
        placeholder="Search in your groups"
        class="w-full bg-dark-50 rounded px-2"
      >
        <template #append>
          <q-icon
            name="search"
            color="primary"
          />
        </template>
      </q-input>
    </q-item>

    <!-- Groups -->
    <router-link
      v-for="group in groups"
      :key="group.id"
      :to="'/group/' + group.id"
    >
      <q-item
        v-ripple
        clickable
        class="rounded bg-dark-50 m-2 border-r-10"
        :style="{ borderColor: group.color}"
      >
        <q-item-section avatar>
          <q-avatar
            size="40px"
            :color="group.color"
          >
            <img :src="group.icon">
          </q-avatar>
        </q-item-section>

        <q-item-section class="font-semibold text-lg ">
          <div class="max-w-[9vw] truncate">
            {{ group.name }}
          </div>
        </q-item-section>
      </q-item>
    </router-link>
  </q-list>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import CreateGroup from './dialogs/CreateGroup.vue'

// models
import { Group } from 'src/models/Group'

// stores
import useUserStore from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    const search = ref('')

    const groups = computed(() => {
      const userGroups = user.value?.ownedGroups ? user.value.ownedGroups : [] as Group[]
      const groups = userGroups?.concat(user.value?.groups ? user.value?.groups : [])
      return groups.filter(g => g.name.includes(search.value))
    })

    const $q = useQuasar()

    const openCreateGroup = () => {
      $q.dialog({
        component: CreateGroup
      }).onOk(async () => {
        await userStore.fetchUser()
      })
    }

    return {
      user,
      groups,
      search,
      openCreateGroup
    }
  }
})
</script>
