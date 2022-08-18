<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input
          v-model="pagination.filter"
          dense
          borderless
          rounded
          debounce="750"
          type="search"
          placeholder="Find users"
          class="w-full bg-dark-50 rounded px-2"
        >
          <template #append>
            <q-icon
              name="search"
              color="primary"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="users"
          hide-header
          hide-pagination
          row-key="id"
          class="h-[400px]"
          flat
        >
          <template #body="props">
            <q-tr>
              <q-item
                clickable
                class="my-2 rounded overflow-hidden"
                @click="promptAddFriend(props.row)"
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
                      :src="props.row.icon"
                      object="cover"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ props.row.displayName }}</q-item-label>
                  <q-item-label
                    caption
                    lines="2"
                  >
                    #{{ props.row.code }}
                  </q-item-label>
                </q-item-section>

                <q-item-section
                  side
                  top
                >
                  <!-- todo: owned groups will be removed, only groups will remain -->
                  <q-item-label caption>
                    In {{ props.row.groups.length + props.row.ownedGroups.length }} groups
                  </q-item-label>

                  <q-item-section
                    class="relative w-full h-full"
                  >
                    <q-avatar
                      v-for="n in props.row.ownedGroups.length < 3 ? props.row.ownedGroups.length : 3"
                      :key="n"
                      size="20px"
                      class="overlapping"
                      :style="`left: ${n * 17}px`"
                    >
                      <img :src="props.row.ownedGroups[n]?.icon">
                    </q-avatar>
                  </q-item-section>
                </q-item-section>
              </q-item>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Cancel"
          @click="onCancelClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

// components
import AddFriendPrompt from './prompts/AddFriendPrompt.vue'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

// stores
import useUsersStore from 'src/stores/users'

// utils

export default defineComponent({
  components: {},
  props: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const usersStore = useUsersStore()
    const { users, total, loading } = storeToRefs(usersStore)

    const pagination = ref<UserPaginationData>({
      limit: 6,
      page: 1,
      filter: ''
    })

    watch(pagination, () => {
      usersStore.fetch(pagination.value)
    }, { deep: true, immediate: true })

    const $q = useQuasar()

    const promptAddFriend = (user: User) => {
      $q.dialog({
        component: AddFriendPrompt,
        componentProps: {
          to: user
        }
      }).onOk(() => {
        onDialogOK()
      })
    }

    return {
      dialogRef,
      onDialogHide,

      promptAddFriend,

      onCancelClick: onDialogCancel,

      users,
      total,
      loading,
      pagination
    }
  }
})
</script>

<style lang="sass" scoped>
.overlapping
  position: absolute
</style>
