<template>
  <q-list
    class="rounded relative"
  >
    <q-item class="flex flex-col gap-2 p-2 sticky top-0 left-0 bg-dark-500 z-50">
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
            <GroupImage :group="group" />
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
import CreateGroup from 'src/components/dialogs/group/CreateGroup.vue'
import GroupImage from 'src/components/reusables/GroupImage.vue'

// models
// import { Group } from 'src/models/Group'

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: { GroupImage },
  props: { },
  emits: [],
  setup () {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const search = ref('')

    const groups = computed(() => user.value?.groups)

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
