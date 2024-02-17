<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin p-2 shadow-none border border-[rgba(255,255,255,0.1)] h-[400px]">
      <q-card-section v-if="user?.groupInvites.length">
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
                <GroupImage
                  :group="gi.group"
                  text-size="4rem"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ gi.group.name }}</q-item-label>
              <q-item-label
                lines="2"
                caption
              >
                {{ gi.group.members?.length || 0 }} members
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
      <q-card-section
        v-else
        class="h-full"
      >
        <div class="h-full w-full flex items-center justify-center text-[1.5rem]">
          No group invites... 🥲
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
import GroupImage from 'src/components/reusables/GroupImage.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'
import { useGroupsStore } from 'src/stores/groups'

// utils

export default defineComponent({
  components: { GroupImage },
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
