<template>
  <q-layout view="lHh LpR lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      behavior="desktop"
      class="bg-dark-900"
    >
      <div
        class="flex flex-col flex-nowrap gap-2 h-full p-2 relative"
      >
        <UserInfo />

        <div
          class="overflow-hidden rounded flex-grow "
        >
          <q-tabs
            v-model="selectedTab"
            class="bg-dark-300"
            dense
            indicator-color="transparent"
            active-color="primary"
            active-class="bg-dark-500"
          >
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :icon="tab.icon"
              :label="tab.label"
              no-caps
            />
          </q-tabs>

          <q-tab-panels
            v-model="selectedTab"
            class="bg-dark-500 h-full"
            animated
          >
            <q-tab-panel
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              class="p-0 py-1 h-full"
            >
              <component
                :is="tab.component"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="bg-dark-900">
      <q-page class="h-screen p-2">
        <router-view />
      </q-page>
    </q-page-container>

    <CallDialog
      ref="callDialogRef"
    />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { socket, setSocketToken } from 'src/boot/socket_io'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { date } from 'quasar'

import { Auth } from 'src/boot/custom-auth'

// components
import UserInfo from 'src/components/UserInfo.vue'
import FriendList from 'src/components/FriendList.vue'
import GroupList from 'src/components/GroupList.vue'
import CallDialog from 'src/components/dialogs/CallDialog.vue'

// models
import { FriendRequest } from 'src/models/FriendRequest'
import { PersonalChat } from 'src/models/PersonalChat'
import { GroupInvite } from 'src/models/GroupInvite'
import { Group } from 'src/models/Group'

// stores
import { useAuthUser } from 'src/stores/auth-user'

export default defineComponent({
  name: 'MainLayout',
  components: { UserInfo, CallDialog },
  setup () {
    const leftDrawerOpen = ref(true)
    const userStore = useAuthUser()

    const { user } = storeToRefs(userStore)

    const notificationSound = new Audio('/sounds/Notification.mp3')

    onMounted(() => {
      refreshToken()

      socket.on('authorization', (status) => {
        if (status === 'failed') {
          socket.disconnect()
        }
      })

      socket.on('invitation-receive', (data: {friendRequest?: FriendRequest, groupInvite?: GroupInvite, type: 'FRIEND_REQUEST' | 'GROUP_INVITE', }) => {
        if (!user.value) {
          return
        }

        switch (data.type) {
          case 'FRIEND_REQUEST': {
            if (!data.friendRequest) return

            const index = user.value.friendRequests.findIndex(fr => fr.id === data.friendRequest?.id)

            if (index < 0) {
              user.value?.friendRequests.push(data.friendRequest)
            }

            break
          }

          case 'GROUP_INVITE': {
            if (!data.groupInvite) return

            const index = user.value.groupInvites.findIndex(fr => fr.id === data.friendRequest?.id)

            if (index < 0) {
              user.value?.groupInvites.push(data.groupInvite)
            }

            break
          }
        }

        notificationSound.play()
      })

      socket.on('invitation-answer-receive', (data: {identifier: string, personalChat?: PersonalChat, group?: Group}) => {
        if (!user.value) {
          return
        }

        if (data.personalChat) {
          // add personal chat on friend request
          user.value.personalChats = user.value.personalChats || []

          if (!user.value.personalChats.length) {
            user.value.personalChats = []
          }

          const friendIndex = user.value.personalChats.findIndex(personalChat => personalChat.id === data.personalChat?.id)
          if (friendIndex < 0) {
            user.value.personalChats.push(data.personalChat)
          }

          const index = user.value.friendRequests.findIndex(fr => fr.id === data.identifier) || -1

          if (index < 0) {
            return
          }

          // remove friend request from the accepting user
          user.value.friendRequests.splice(index, 1)
        } else if (data.group) {
          // add group on groups list
          user.value.groups = user.value.groups || []

          if (!user.value.groups.length) {
            user.value.groups = []
          }

          const groupIndex = user.value.groups.findIndex(group => group.id === data.group?.id)
          if (groupIndex < 0) {
            user.value.groups.push(data.group)
          }

          const index = user.value?.groupInvites.findIndex(fr => fr.id === data.identifier) || -1

          if (index < 0) {
            return
          }

          // remove friend request from the accepting user
          user.value?.groupInvites.splice(index, 1)
        }
      })
    })

    const tabs = [
      { name: 'friends', icon: 'groups', label: 'Friends', component: FriendList },
      { name: 'groups', icon: 'workspaces', label: 'Groups', component: GroupList }
    ]

    const selectedTab = ref(tabs[0].name)

    const consoleOn = false
    const refreshToken = async () => {
      consoleOn && console.log(`AUTH: Timestamp [${date.formatDate(Date.now(), 'hh:mm:ss')}] `)

      const threshold = 60 * 2 * 1000 // 2 minutes

      const { tokenState } = Auth()
      const { diff, hasToken, isOverThreshold, isValid } = tokenState(threshold) // 2 minute threshold

      if (!hasToken) {
        consoleOn && console.log('AUTH: No token in local storage, redirecting for login')
        useRouter().push('/auth/login')
      } else {
        consoleOn && console.log('AUTH: Has token with state: ', !isValid ? '❌ EXPIRED' : '✔ VALID')
        if (isValid) {
          if (!userStore.user) {
            await userStore.fetchUser()
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setSocketToken(user.value!.jwtToken!)

          if (isOverThreshold) {
            const timeout = (diff - threshold) + (30 * 1000) // timeout half a minute after the threshold
            consoleOn && console.log(`AUTH: Setting up timeout at ${date.formatDate(Date.now() + timeout, 'hh:mm:ss')}`)

            setTimeout(async () => {
              consoleOn && console.log(`AUTH: Timeout is fired at [${date.formatDate(Date.now(), 'hh:mm:ss')}]`)
              refreshToken()
            }, timeout)
          } else {
            consoleOn && console.log('AUTH: Token has less than 2 minutes to expire, refreshing token...')
            await userStore.refreshToken()
            refreshToken()
          }
        } else {
          console.log('AUTH: Token cannot be refreshed anymore, rerouting to logout')
          useRouter().push('/auth/login')
        }
      }
    }

    return {
      leftDrawerOpen,
      selectedTab,
      tabs
    }
  }
})
</script>

<style>
.q-tab > .q-tab__content {
  flex: row;
  flex-direction: row;
  align-items: center;
  justify-items: end;
  gap: 8px;

}

.q-tab > .q-tab__content > * {
  font-size: 18px;
}
</style>
