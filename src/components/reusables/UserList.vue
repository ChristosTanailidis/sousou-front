<template>
  <q-card class="q-dialog-plugin">
    <q-card-section>
      <q-input
        v-if="paginationObj"
        v-model="paginationObj.filter"
        dense
        borderless
        rounded
        debounce="750"
        type="search"
        placeholder="Find users"
        class="w-full bg-dark-50 rounded px-2"
      >
        <template #append>
          <q-icon
            name="search"
            color="primary"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <q-table
        :rows="users"
        hide-header
        hide-pagination
        row-key="id"
        class="h-[400px]"
        flat
      >
        <template #body="props">
          <q-tr>
            <div class="relative">
              <UserItem
                code
                groups-indicator
                :user="props.row"
                @click="$emit('userSelect', props.row)"
              />
              <slot :user="props.row" />
            </div>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'

// components
import UserItem from './UserItem.vue'

// models
import { PaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

export default defineComponent({
  components: { UserItem },
  props: {
    users: {
      type: Array as PropType<User[]>,
      default: () => []
    },
    pagination: {
      type: Object as PropType<PaginationData>,
      default: undefined
    }
  },
  emits: ['update:pagination', 'userSelect'],
  setup (props, { emit }) {
    const paginationObj = ref({ ...props.pagination })

    watch(paginationObj, () => {
      emit('update:pagination', paginationObj.value)
    }, { deep: true })

    return {
      paginationObj
    }
  }
})
</script>

<style lang="sass" scoped>
// todo: delete this
.overlapping
  position: absolute
</style>
