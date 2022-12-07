<template>
  <q-card
    flat
  >
    <q-form
      class="w-[75%]"
      @submit="onSubmit"
      @reset="onReset"
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

      <q-card-actions class="flex gap-1">
        <q-btn
          unelevated
          icon="save"
          label="save"
          color="primary"
          class="flex-grow"
          type="submit"
        />
        <q-btn
          unelevated
          color="secondary"
          label="Reset"
          icon="restart_alt"
          type="reset"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

// components

// models
import { Group } from 'src/models/Group'
import { GroupInputData } from 'src/models/InputData'

// stores
import { useGroupsStore } from 'src/stores/groups'

// utils
import notify from 'src/utils/notify'

export default defineComponent({
  components: {},
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true
    }
  },
  emits: [],
  setup (props) {
    // todo: find a better way?
    const groupData = ref<GroupInputData>({
      color: props.group.color,
      icon: props.group.icon,
      name: props.group.name
    })
    const originalGroupData = { ...groupData.value } as GroupInputData

    const groupsStore = useGroupsStore()

    const onSubmit = async () => {
      const resp = await groupsStore.updateGroup(props.group.id, groupData.value)
      if (!resp) {
        return
      }

      notify('success', 'Saved')

      await groupsStore.fetchGroup(props.group.id)
    }
    return {
      groupData,
      onSubmit,
      onReset: () => { groupData.value = { ...originalGroupData } }
    }
  }
})
</script>
