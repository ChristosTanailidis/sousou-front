<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin h-[400px]">
      <q-card-section>
        <div
          v-for="gi in user?.groupInvites"
          :key="gi.id"
          class="my-2 rounded overflow-hidden bg-dark-100"
        >
          <q-item
            @mouseover="hoveredItem = gi.id"
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
                  :src="gi.group.icon"
                  object="cover"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ gi.group.name }}</q-item-label>
              <q-item-label
                lines="2"
                caption
              >
                {{ gi.group.members.length }} members
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
                  @click="groupInviteAction(false, gi.id)"
                />
                <q-btn
                  dense
                  no-caps
                  unelevated
                  color="primary"
                  label="Accept"
                  class="w-18"
                  @click="groupInviteAction(true, gi.id)"
                />
              </div>
            </q-item-section>
          </q-item>

          <q-slide-transition>
            <div v-show="hoveredItem === gi.id">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    User <span class="font-semibold">{{ gi.fromUser.displayName }}</span> invites you:
                  </q-item-label>
                  <q-item-label>
                    {{ gi.message }}
                  </q-item-label>
                </q-item-section>
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
import { useAuthUser } from 'src/stores/auth-user'
import { useGroupsStore } from 'src/stores/groups'

// utils

export default defineComponent({
  components: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const userStore = useAuthUser()
    const groupsStore = useGroupsStore()

    const { user } = storeToRefs(userStore)

    const { dialogRef, onDialogHide } = useDialogPluginComponent()

    const groupInviteAction = async (answer: boolean, id: string) => {
      await groupsStore.answerInvite(answer, id)
      await userStore.fetchUser()
    }

    return {
      dialogRef,
      onDialogHide,

      user,

      hoveredItem: ref(),
      groupInviteAction
    }
  }
})
</script>