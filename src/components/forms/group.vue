<template>
  <FormKit
    v-model="groupObj"
    type="form"
    submit-label="Create"
    @submit="submitHandler"
  >
    <FormKit
      label="Group Name"
      name="name"
      type="text"
      validation="required"
    />
    <FormKit
      label="Icon"
      name="icon"
      type="text"
      validation="required"
    />
    <FormKit
      label="Color"
      name="color"
      type="text"
      validation="required"
    />
  </FormKit>
</template>

<script setup lang="ts">
// interfaces
import type Group from '~/assets/entities/group'
import type GroupInputData from '~/assets/entities/input-data/group'

// stores
import { useGroups } from '~/stores/groups'

const groupObj = ref<Group|undefined>()

const groupsStore = useGroups()

// todo: check this when resolver is ready
const submitHandler = async() => {
  const payload = {
    ...groupObj.value,
  } as GroupInputData

  const result = await groupsStore.createGroup(payload)

  if (!result) return

  console.log(result)
}
</script>
