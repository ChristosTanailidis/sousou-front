<template>
  <div
    v-if="props.value" class="dialog"
    @click.self="emits('update:value', false)"
  >
    <div
      class="dialog-container"
    >
      <pre>
        {{ groupObj }}
      </pre>
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
    </div>
  </div>
</template>

<script setup lang="ts">
// interfaces
import type Group from '~/assets/entities/group'
import type { GroupInputData } from '~/assets/input-data/group'

// stores
import { useGroups } from '~/stores/groups'
// import { useLocalUser } from '~/stores/local-user'

const emits = defineEmits(['update:value'])

const props = defineProps({
  value: Boolean,
})

const groupObj = ref<Group|undefined>()

const groupsStore = useGroups()

// todo: check this when resolver is ready
const submitHandler = () => {
  const payload = {
    ...groupObj.value,
    // ownerId: useLocalUser().id, // todo: change this
    ownerId: 'a1fb2930-c2cd-497c-859e-eb99a6e06cff', // temporary
  } as GroupInputData

  groupsStore.createGroup(payload)

  console.log(payload)
}
</script>
