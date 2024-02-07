<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-form
        @submit.prevent="createGroup"
        @reset="cancel"
      >
        <q-card-section class="flex flex-col flex-nowrap gap-2">
          <q-input
            v-model="groupData.name"
            type="text"
            label="Name"
            :rules="[
              val => !!val || 'Name is required',
              val => val.length > 5 || 'A group name must contain at least 5 characters'
            ]"
          />

          <q-input
            v-model="groupData.icon"
            type="url"
            label="Icon"
            class="pb-4"
            :rules="[
              val => !!val || 'Icon is required',
            ]"
          />

          <q-input
            v-model="groupData.color"
            label="Color"
            :rules="[
              val => !!val || 'Color is required',
              'hexColor'
            ]"
          >
            <template #append>
              <q-icon
                name="palette"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color v-model="groupData.color" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions align="right">
          <q-btn
            type="submit"
            color="primary"
            label="OK"
            class="w-[5rem]"
          />
          <q-btn
            type="reset"
            color="primary"
            label="Cancel"
            class="w-[5rem]"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

// components

// models
import { GroupInputData } from 'src/models/InputData'

// stores
import { useGroupsStore } from 'src/stores/groups'

// utils

export default defineComponent({
  components: {},
  props: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const useGroupStore = useGroupsStore()

    const groupData = ref<GroupInputData>({
      color: '#000000',
      icon: '',
      name: ''
    })

    const createGroup = async () => {
      const response = await useGroupStore.createGroup(groupData.value)
      if (!response) {
        return
      }
      onDialogOK()
    }

    const cancel = () => {
      onDialogCancel()
    }

    return {
      dialogRef,
      onDialogHide,
      createGroup,
      cancel,

      groupData
    }
  }
})
</script>
