<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin p-2 shadow-none border border-[rgba(255,255,255,0.1)]">
      <q-card-actions>
        <div class="flex flex-nowrap justify-between w-full">
          <div class="text-xl font-extralight">
            Edit Groups Preferences
          </div>
          <div class="row gap-2">
            <q-btn
              flat
              round
              icon="close"
              class="p-0"
              @click="onCancelClick"
            />
          </div>
        </div>
      </q-card-actions>

      <q-card-section>
        <div class="grid grid-cols-10 gap-1">
          <q-tabs
            v-model="selectedTab"
            vertical
            class="col-span-2"
          >
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
            />
          </q-tabs>

          <q-tab-panels
            v-model="selectedTab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
            class="col-span-8"
          >
            <q-tab-panel
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
            >
              <component
                :is="tab.component"
                v-bind="tab.componentProps"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

// components
import GroupGeneralSettings from 'src/components/settings/group/GroupGeneralSettings.vue'
// import GroupPreferencesSettings from 'src/components/settings/group/GroupPreferencesSettings.vue'
// import GroupMembersSettings from 'src/components/settings/group/GroupMembersSettings.vue'

// models
import { Group } from 'src/models/Group'

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const groupData = ref({ ...props.group })

    const tabs = [
      {
        name: 'general',
        label: 'General',
        component: GroupGeneralSettings,
        componentProps: { group: groupData.value }
      }
      // {
      //   name: 'preferences',
      //   label: 'Preferences',
      //   component: GroupPreferencesSettings,
      //   componentProps: { group: groupData.value }
      // },
      // {
      //   name: 'members_and_invites',
      //   label: 'Members & Invites',
      //   component: GroupMembersSettings,
      //   componentProps: { group: groupData.value }
      // }
    ]

    const selectedTab = ref(tabs[0].name)

    return {
      dialogRef,
      onDialogHide,

      onOKClick () {
        onDialogOK()
      },

      onCancelClick: onDialogCancel,

      tabs,
      selectedTab
    }
  }
})
</script>
