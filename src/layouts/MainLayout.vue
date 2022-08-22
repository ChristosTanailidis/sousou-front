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
        class="flex flex-col gap-2 h-full p-2"
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { date } from 'quasar'

import { Auth } from 'src/boot/custom-auth'

// components
import UserInfo from 'src/components/UserInfo.vue'
import FriendList from 'src/components/FriendList.vue'
import GroupList from 'src/components/GroupList.vue'

// models

// stores
import useUserStore from 'src/stores/auth-user'

export default defineComponent({
  name: 'MainLayout',
  components: { UserInfo },
  setup () {
    const leftDrawerOpen = ref(true)
    const userStore = useUserStore()
    onMounted(() => {
      refreshToken()
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
