<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin h-[400px]">
      <q-card-section>
        <!-- todo: User.groupInvites population ??? -->
        <!-- todo: allios kanoume fetch kai ta group inv, kai ta friend request!! -->
        <div
          v-for="fr in user?.groupInvites"
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
                  @click="GroupInviteAction(false, fr.id)"
                />
                <q-btn
                  dense
                  no-caps
                  unelevated
                  color="primary"
                  label="Accept"
                  class="w-18"
                  @click="GroupInviteAction(true, fr.id)"
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
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const userStore = useAuthUser()

    const { user } = storeToRefs(userStore)

    const { dialogRef, onDialogHide } = useDialogPluginComponent()

    const GroupInviteAction = (answer: boolean, id: string) => {
      console.log(answer, id)
    }

    return {
      dialogRef,
      onDialogHide,

      user,

      hoveredItem: ref(),
      GroupInviteAction
    }
  }
})
</script>
