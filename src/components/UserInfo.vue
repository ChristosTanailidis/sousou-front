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
            <UserImage
              v-if="user"
              :user="user"
              text-size="2.5rem"
            />
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
            <div class="relative">
              <q-btn
                flat
                round
                icon="notifications"
                color="grey-5"
                size="sm"
                @click="notificationsMenu = !notificationsMenu"
              />

              <div
                v-if="user?.friendRequests.length || user?.groupInvites.length"
                class="bg-primary w-3 h-3 rounded-full absolute top-0.5 right-0.5 overflow-hidden leading-3 flex items-center justify-center text-[0.6rem]"
              >
                {{ (user?.friendRequests.length || 0) + (user?.groupInvites.length || 0) }}
              </div>
            </div>

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
import { computed, defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import MyFriendRequests from 'src/components/dialogs/user/MyFriendRequests.vue'
import MyGroupInvites from './dialogs/user/MyGroupInvites.vue'
import UserSettings from './dialogs/user/UserSettings.vue'
import UserImage from 'src/components/reusables/UserImage.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {
    UserImage
  },
  setup () {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const $q = useQuasar()

    const notifications = computed(() => [
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
        badge: user.value?.groupInvites.length,
        action: () => {
          $q.dialog({
            component: MyGroupInvites
          }).onOk(async () => {
            // todo: if changes where made!
            await userStore.fetchUser()
          })
        }
      }
    ])

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
