<template>
  <q-dialog
    ref="dialogRef"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin shadow-none border border-[rgba(255,255,255,0.1)]">
      <q-card-actions>
        <div class="flex flex-nowrap justify-between w-full">
          <div class="text-xl font-extralight">
            Edit User Preferences
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
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { storeToRefs } from 'pinia'

// components
import UserGeneralSettings from '../../settings/user/UserGeneralSettings.vue'
import UserPreferencesSettings from '../../settings/user/UserPreferencesSettings.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const tabs = [
      {
        name: 'general',
        label: 'General',
        component: UserGeneralSettings,
        componentProps: { user: user.value }
      }
      // {
      //   name: 'preferences',
      //   label: 'Preferences',
      //   component: UserPreferencesSettings
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
