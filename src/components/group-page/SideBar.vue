<template>
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
      :caption="`${group.textChannels.length} available`"
      group="group"
    >
      <div class="px-2 pt-2">
        <q-btn
          flat
          no-caps
          dense
          color="primary"
          icon="add"
          label="Create Text Channel"
          class="w-full "
          @click="manageCreateChannelDialog('text')"
        />
      </div>
      <q-item
        v-for="textChannel in group.textChannels"
        :key="textChannel.id"
        v-ripple
        clickable
        dense
        class="rounded m-1"
        :to="`/group/${group.id}/text/${textChannel.id}`"
      >
        <q-item-section class="font-semibold">
          {{ textChannel.name }}
        </q-item-section>
      </q-item>
    </ExpansionItem>

    <ExpansionItem
      :header-ref="headerRef"
      icon="mic"
      label="Voice Channel"
      :caption="`${group.voiceChannels?.length} available`"
      group="group"
    >
      <div class="px-2 pt-2">
        <q-btn
          flat
          no-caps
          color="primary"
          icon="add"
          label="Create Voice Channel"
          class="w-full"
          @click="manageCreateChannelDialog('voice')"
        />
      </div>
      <q-item
        v-for="voiceChannel in group.voiceChannels"
        :key="voiceChannel.id"
        v-ripple
        clickable
        dense
        class="rounded m-1"
        :to="`/group/${group.id}/voice/${voiceChannel.id}`"
      >
        <q-item-section class="font-semibold">
          {{ voiceChannel.name }}
        </q-item-section>
      </q-item>
    </ExpansionItem>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType } from 'vue'
import { useQuasar } from 'quasar'

// components
import TextChannel from 'src/components/dialogs/channels/TextChannel.vue'
import VoiceChannel from 'src/components/dialogs/channels/VoiceChannel.vue'
import ExpansionItem from './ExpansionItem.vue'
import MemberProperties from '../reusables/MemberProperties.vue'

// models
import { Group } from 'src/models/Group'

// stores

// utils

export default defineComponent({
  components: { ExpansionItem, MemberProperties },
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
          manageDialogs(VoiceChannel, { channelType }) // todo
          break
        }
        case 'text': {
          manageDialogs(TextChannel, { channelType }) // todo
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
