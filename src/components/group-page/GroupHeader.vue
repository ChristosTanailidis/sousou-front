<template>
  <div
    class="flex flex-nowrap items-center gap-4 h-[80px] border-b-2"
    :style="{borderColor: group.color}"
  >
    <div>
      <q-avatar
        class="h-[78px] w-[78px]"
        square
      >
        <GroupImage
          :group="group"
          text-size="4rem"
        />
      </q-avatar>
    </div>

    <div class="text-xl font-semibold self-start my-1">
      <div class="flex flex-col gap-2 justify-center">
        <div>
          {{ group.name }}
        </div>
        <div class="flex flex-nowrap gap-2 items-center">
          <div class="font-thin text-xs">
            {{ group.members.length }} members on {{ group.owner.id === user?.id ? 'your' : 'this' }} group
          </div>
          <div v-if="group.owner.id === user?.id">
            <q-icon
              name="mdi-crown "
            />
            <q-tooltip>
              You are the owner of this group
            </q-tooltip>
          </div>
        </div>
      </div>
    </div>

    <q-space />

    <div class="flex no-wrap gap-1 my-1 mr-5">
      <q-btn
        v-if="(group.owner.id === user?.id || group.invitationPermissionUsers.find(p => p.id === user?.id))"
        flat
        round
        unelevated
        icon="group_add"
        color="primary"
        @click="manageGroupInvitesDialog"
      />
      <q-btn
        v-if="group.owner.id === user?.id"
        flat
        round
        unelevated
        icon="settings"
        @click="manageGroupSettingsDialog"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import GroupSettings from 'src/components/dialogs/group/GroupSettings.vue'
import InviteMembers from 'src/components/dialogs/group/InviteMembers.vue'
import GroupImage from 'src/components/reusables/GroupImage.vue'

// models
import { Group } from 'src/models/Group'

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: { GroupImage },
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true
    }
  },
  emits: [],
  setup (props) {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const $q = useQuasar()

    const manageDialogs = (component: Component, componentProps: unknown) => {
      $q.dialog({
        component,
        componentProps
      }).onOk(() => {
        console.log('ok')
      }).onCancel(() => {
        console.log('cancel')
      }).onDismiss(() => {
        console.log('dismissed')
      })
    }

    const manageGroupSettingsDialog = () => manageDialogs(GroupSettings, { group: props.group })
    const manageGroupInvitesDialog = () => manageDialogs(InviteMembers, { group: props.group })

    return {
      manageGroupSettingsDialog,
      manageGroupInvitesDialog,
      user
    }
  }
})
</script>
