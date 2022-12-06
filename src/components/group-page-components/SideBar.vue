<template>
  <div
    class="grid grid-cols-10 h-full"
  >
    <div
      class="col-span-2 flex flex-col flex-nowrap w-full h-full bg-dark-400 shadow-2xl"
    >
      <ExpansionItem
        :header-ref="headerRef"
        default-opened
        icon="group"
        label="Members"
        caption="4 Online"
        group="group"
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

          <MemberProperties />
        </q-item>
      </ExpansionItem>

      <ExpansionItem
        :header-ref="headerRef"
        icon="chat"
        label="Text Channel"
        caption="2 Online"
        group="group"
      >
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
      </ExpansionItem>

      <ExpansionItem
        :header-ref="headerRef"
        icon="mic"
        label="Voice Channel"
        caption="50 Connected"
        group="group"
      >
        <q-btn
          flat
          no-caps
          color="primary"
          icon="add"
          label="Create Voice Channel"
          class="w-full"
          @click="manageCreateChannelDialog('voice')"
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
      </ExpansionItem>
    </div>

    <div class="col-span-8 bg-dark-200">
      <!-- todo: component gia chat/voice -->
      <ChatContainer />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType } from 'vue'
import { useQuasar } from 'quasar'

// components
import ChannelDialog from 'src/components/dialogs/channels/ChannelDialog.vue'
import ExpansionItem from './ExpansionItem.vue'

// models
import { Group } from 'src/models/Group'
import MemberProperties from '../reusables/MemberProperties.vue'
import ChatContainer from './ChatContainer.vue'

// stores

// utils

export default defineComponent({
  components: { ExpansionItem, MemberProperties, ChatContainer },
  props: {
    headerRef: {
      type: Object as PropType<Element>,
      default: undefined
    },
    group: {
      type: Object as PropType<Group>,
      required: true
    }
  },
  emits: [],
  setup () {
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

    const manageCreateChannelDialog = (channelType: 'voice' | 'text') => {
      switch (channelType) {
        case 'voice': {
          manageDialogs(ChannelDialog, { channelType }) // todo
          break
        }
        case 'text': {
          manageDialogs(ChannelDialog, { channelType }) // todo
          break
        }
      }
    }

    return {
      manageCreateChannelDialog
    }
  }
})
</script>
