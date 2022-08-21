<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin h-[400px]">
      <q-card-section>
        <div
          v-for="fr in user?.friendRequests"
          :key="fr.id"
          class="my-2 rounded overflow-hidden bg-dark-100"
        >
          <q-item
            @mouseover="hoveredItem = fr.id"
            @mouseleave="hoveredItem = undefined"
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
                  :src="fr.fromUser.icon"
                  object="cover"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ fr.fromUser.displayName }}</q-item-label>
              <q-item-label
                caption
                lines="2"
              >
                #{{ fr.fromUser.code }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row flex-nowrap gap-1">
                <q-btn
                  dense
                  flat
                  no-caps
                  color="primary"
                  label="Decline"
                  class="w-18"
                  @click="friendRequestAction(false, fr.id)"
                />
                <q-btn
                  dense
                  no-caps
                  unelevated
                  color="primary"
                  label="Accept"
                  class="w-18"
                  @click="friendRequestAction(true, fr.id)"
                />
              </div>
            </q-item-section>
          </q-item>

          <q-slide-transition>
            <div v-show="hoveredItem === fr.id">
              <q-item>
                {{ fr.message }}
              </q-item>
            </div>
          </q-slide-transition>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { storeToRefs } from 'pinia'

// components

// models

// stores
import useUserStore from 'src/stores/auth-user'
import useUsersStore from 'src/stores/users'

// utils

export default defineComponent({
  components: {},
  props: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide } = useDialogPluginComponent()

    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    const usersStore = useUsersStore()

    const friendRequestAction = async (accept: boolean, id: string) => {
      await usersStore.answerFriendRequest(accept, id)
      await userStore.fetchUser()
    }

    return {
      dialogRef,
      onDialogHide,

      user,
      hoveredItem: ref(),

      friendRequestAction
    }
  }
})
</script>
