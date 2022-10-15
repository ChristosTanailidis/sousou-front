<template>
  <div
    class="rounded overflow-hidden h-full bg-dark-500"
  >
    <div
      v-if="group"
      class="flex flex-col flex-nowrap h-full"
    >
      <div ref="headerRef">
        <div
          class="flex flex-nowrap items-center gap-4 h-[80px] border-b-2"
          :style="{borderColor: group.color}"
        >
          <div>
            <q-avatar
              class="h-[78px] w-[78px]"
              square
            >
              <q-img
                :src="group.icon"
                fit="cover"
                class="h-full w-full"
              />
            </q-avatar>
          </div>

          <div class="text-xl font-semibold self-start my-1">
            <div class="flex flex-col gap-2 justify-center">
              <div>
                {{ group.name }}
              </div>
              <div class="flex flex-nowrap gap-2 items-center">
                <div class="font-thin text-xs">
                  {{ group.members.length }} members on {{ group.owner.id === user?.id ? 'your' : 'this' }} group
                </div>
                <div v-if="group.owner.id === user?.id">
                  <q-icon
                    name="mdi-crown "
                  />
                  <q-tooltip>
                    You are the owner of this group
                  </q-tooltip>
                </div>
              </div>
            </div>
          </div>

          <q-space />

          <div class="flex no-wrap gap-1 my-1 mr-5">
            <q-btn
              flat
              round
              unelevated
              icon="group_add"
              color="primary"
              @click="manageGroupInvitesDialog"
            />
            <q-btn
              flat
              round
              unelevated
              icon="settings"
              @click="manageGroupSettingsDialog"
            />
          </div>
        </div>
      </div>
      <div
        class="grid grid-cols-10 h-full"
      >
        <div
          class="col-span-2 flex flex-col flex-nowrap w-full h-full bg-dark-400 shadow-2xl"
        >
          <q-expansion-item
            default-opened
            group="group"
            icon="group"
            label="Members"
            caption="4 Online"
            expand-icon="none"
            header-class="bg-dark-400"
          >
            <q-list
              :style="{
                maxHeight: `calc(100vh - ( 250px + ${headerRef ? headerRef.clientHeight : '0px'} ))`,
                overflowY: 'auto'}"
              class="bg-dark-300"
            >
              <q-item
                v-for="member in group.members"
                :key="member.id"
                v-ripple
                clickable
              >
                <q-item-section avatar>
                  <q-avatar :style="{backgroundColor: group.color}">
                    <q-img
                      :src="member.icon"
                      spinner-color="primary"
                      fit="cover"
                      class="h-full w-full"
                    >
                      <template #error>
                        <q-img
                          src="https://placeimg.com/500/300/nature"
                          spinner-color="primary"
                          fit="cover"
                          class="h-full w-full"
                        />
                      </template>
                    </q-img>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <div>
                    <span>
                      {{ member.displayName }}
                    </span>
                    <span class="font-thin text-gray-300">
                      #{{ member.code }}
                    </span>
                  </div>
                </q-item-section>

                <q-menu touch-position>
                  <q-list
                    separator
                    style="min-width: 100px"
                  >
                    <q-item
                      v-close-popup
                      clickable
                    >
                      <q-item-section>Add Friend</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                    >
                      <q-item-section>View Profile</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      clickable
                    >
                      <q-item-section>more...</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-expansion-item>
          <q-expansion-item
            group="group"
            icon="chat"
            label="Text Channel"
            caption="2 Online"
            expand-icon="none"
            header-class="bg-dark-400"
          >
            <q-list
              :style="{
                maxHeight: `calc(100vh - ( 250px + ${headerRef ? headerRef.clientHeight : '0px'} ))`,
                overflowY: 'auto'}"
              class="bg-dark-300"
            >
              <!-- todo: this button -->
              <q-btn
                flat
                no-caps
                color="primary"
                icon="add"
                label="Create Text Channel"
                class="w-full "
                @click="manageCreateChannelDialog('text')"
              />
              <q-item
                v-ripple
                clickable
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="bluetooth"
                  />
                </q-item-section>
                <q-item-section>Icon as avatar</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
          <q-expansion-item
            group="group"
            icon="mic"
            label="Voice Channel"
            caption="50 Connected"
            expand-icon="none"
            header-class="bg-dark-400"
          >
            <!-- todo: this button -->
            <q-btn
              flat
              no-caps
              color="primary"
              icon="add"
              label="Create Voice Channel"
              class="w-full"
              @click="manageCreateChannelDialog('text')"
            />
            <q-list
              :style="{
                maxHeight: `calc(100vh - ( 250px + ${headerRef ? headerRef.clientHeight : '0px'} ))`,
                overflowY: 'auto' }"
              class="bg-dark-300"
            >
              <q-item
                v-for="i in 50"
                :key="'voice' + i"
                v-ripple
                clickable
              >
                <q-item-section avatar>
                  <q-icon
                    color="primary"
                    name="bluetooth"
                  />
                </q-item-section>
                <q-item-section>Icon as avatar</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>

        <div class="col-span-8 bg-dark-200">
          <!-- todo: component gia chat/voice -->
          <div class="flex flex-col flex-nowrap gap-2 h-full">
            <div class="flex-grow q-pa-md row justify-center">
              <div style="width: 100%">
                <q-chat-message
                  name="<span class='text-positive'>Untrusted Source</span>"
                  avatar="https://cdn.quasar.dev/img/avatar3.jpg"
                  :text="['hey, how are <strong>you</strong>?']"
                  stamp="7 minutes ago"
                  sent
                  bg-color="amber-7"
                />
                <q-chat-message
                  name="<span class='text-negative'>Jane (trusted name but untrusted text)</span>"
                  name-html
                  avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                  :text="[
                    'doing fine, how r you?',
                    'I just feel like typing a really, really, <strong>REALLY</strong> long message to annoy you...'
                  ]"
                  size="6"
                  stamp="4 minutes ago"
                  text-color="white"
                  bg-color="primary"
                />
                <q-chat-message
                  name="<span class='text-negative'>Jao (trusted)</span>"
                  name-html
                  avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                  :text="['<strong>Did it work?</strong>']"
                  text-html
                  stamp="1 minutes ago"
                  size="8"
                  text-color="white"
                  bg-color="primary"
                />
              </div>
            </div>
            <div>
              <!-- <q-input
                v-model="text"
                type="text"
                label="Message"
                class="p-2"
              /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-full w-full flex items-center justify-center"
    >
      No Group Sorry!
    </div>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import GroupSettings from 'src/components/dialogs/GroupSettings.vue'
import InviteMembers from 'src/components/dialogs/InviteMembers.vue'

// models

// stores
import useGroupsStore from 'src/stores/groups'
import useUserStore from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  emits: [],
  setup (props) {
    const groupsStore = useGroupsStore()
    const userStore = useUserStore()

    const { group } = storeToRefs(groupsStore)
    const { user } = storeToRefs(userStore)

    watch(() => props.groupId, async () => {
      await groupsStore.fetchGroup(props.groupId)
    }, { immediate: true })

    const $q = useQuasar()

    const manageDialogs = (component: Component, componentProps: unknown) => {
      $q.dialog({
        component,
        componentProps
      }).onOk(() => {
        console.log('ok')
      }).onCancel(() => {
        console.log('cancel')
      }).onDismiss(() => {
        console.log('dismissed')
      })
    }

    const manageGroupSettingsDialog = () => manageDialogs(GroupSettings, { group: group.value })
    const manageGroupInvitesDialog = () => manageDialogs(InviteMembers, { group: group.value })

    const manageCreateChannelDialog = (chanelType: 'voice' | 'text') => {
      switch (chanelType) {
        case 'voice': {
          manageDialogs(GroupSettings, { group: group.value }) // todo
          break
        }
        case 'text': {
          manageDialogs(GroupSettings, { group: group.value }) // todo
          break
        }
      }
    }

    return {
      group,
      user,

      manageGroupSettingsDialog,
      manageGroupInvitesDialog,
      manageCreateChannelDialog,

      settingsMenu: ref(false),
      headerRef: ref()
    }
  }
})

</script>
