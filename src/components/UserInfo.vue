<template>
  <div ref="userInfoCard">
    <q-card
      class="my-card bg-dark-500"
      flat
    >
      <q-card-section
        horizontal
        class="items-center overflow-hidden"
      >
        <q-card-section class="p-0">
          <q-avatar
            size="70px"
            color="primary"
            square
          >
            <q-img
              :src="user?.icon"
              spinner-color="white"
              fit="cover"
              class="h-full w-full"
            >
              <template #error>
                <q-img
                  src="https://cdn.quasar.dev/img/avatar.png"
                  spinner-color="white"
                  fit="cover"
                  class="h-full w-full"
                />
              </template>
            </q-img>
          </q-avatar>
        </q-card-section>

        <q-card-section class="py-0 flex flex-col h-full w-full gap-2">
          <div class="row gap-1 items-center justify-start">
            <div class="font-semibold">
              {{ user?.displayName }}
            </div>
            <div class="font-thin text-xs">
              #{{ user?.code }}
            </div>
          </div>

          <div class="row gap-2 justify-between">
            <q-btn
              flat
              round
              icon="notifications"
              :color="user?.friendRequests.length ? 'primary' : 'grey-5'"
              size="sm"
              @click="notificationsMenu = !notificationsMenu"
            />

            <div class="row flex-nowrap gap-2">
              <q-btn
                flat
                round
                color="grey-5"
                icon="settings"
                size="sm"
                @click="openSettings"
              />

              <!-- todo: prompt before logout -->
              <q-btn
                flat
                round
                to="/auth/logout"
                icon="logout"
                color="negative"
                size="sm"
              />
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-menu
      v-model="notificationsMenu"
      no-parent-event
      :style="{ width: userInfoCard?.clientWidth + 'px' }"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="from-dark-300 bg-gradient-to-b to-dark-200 shadow-none"
      transition-duration="200"
      square
    >
      <q-list
        separator
      >
        <q-item
          v-for="notification in notifications"
          :key="notification.type"
          v-close-popup
          clickable
          @click="notification.action"
        >
          <q-item-section avatar>
            <q-icon :name="notification.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ notification.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge
              v-if="notification.badge"
              color="primary"
              :label="notification.badge"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import MyFriendRequests from 'src/components/dialogs/MyFriendRequests.vue'

// models

// stores
import useUserStore from 'src/stores/auth-user'
import UserSettings from './dialogs/UserSettings.vue'

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    const $q = useQuasar()

    const notifications = [
      {
        type: 'friend_request',
        label: 'Friend Requests',
        icon: 'group',
        badge: user.value?.friendRequests.length,
        action: () => {
          $q.dialog({
            component: MyFriendRequests
          }).onOk(async () => {
            // todo: if changes where made!
            await userStore.fetchUser()
          })
        }
      },
      {
        type: 'group_invite',
        label: 'Group Invites',
        icon: 'o_workspaces',
        badge: user.value?.groups.length,
        action: () => undefined
      }
    ]

    const openSettings = () => {
      $q.dialog({
        component: UserSettings
      })
    }

    return {
      user,
      notifications,
      notificationsMenu: ref(false),
      userInfoCard: ref(),
      openSettings
    }
  }
})
</script>
