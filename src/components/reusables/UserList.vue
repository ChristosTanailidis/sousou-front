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
            <q-item
              clickable
              class="my-2 rounded overflow-hidden"
              @click="$emit('availabilityChange', false, props.row)"
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
                    :src="props.row.icon"
                    object="cover"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ props.row.displayName }}</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                >
                  #{{ props.row.code }}
                </q-item-label>
              </q-item-section>

              <q-item-section
                side
                top
              >
                <!-- todo: owned groups will be removed, only groups will remain -->
                <q-item-label caption>
                  In {{ props.row.groups.length + props.row.ownedGroups.length }} groups
                </q-item-label>

                <q-item-section
                  class="relative w-full h-full"
                >
                  <q-avatar
                    v-for="n in props.row.ownedGroups.length < 3 ? props.row.ownedGroups.length : 3"
                    :key="n"
                    size="20px"
                    class="overlapping"
                    :style="`left: ${n * 17}px`"
                  >
                    <img :src="props.row.ownedGroups[n]?.icon">
                  </q-avatar>
                </q-item-section>
              </q-item-section>
            </q-item>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'

// components

// models
import { PaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true
    },
    pagination: {
      type: Object as PropType<PaginationData>,
      default: undefined
    }
  },
  emits: ['update:pagination', 'availabilityChange'],
  setup (props, { emit }) {
    const paginationObj = ref({ ...props.pagination })

    watch(paginationObj, () => {
      console.log('running inside')
      emit('update:pagination', paginationObj.value)
    }, { deep: true })

    return {
      paginationObj
    }
  }
})
</script>

<style lang="sass" scoped>
.overlapping
  position: absolute
</style>
