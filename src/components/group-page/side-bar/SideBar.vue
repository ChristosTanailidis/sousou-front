<template>
  <div
    class="col-span-2 flex flex-col flex-nowrap w-full h-full bg-dark-400 shadow-2xl"
  >
    <ExpansionItem
      :header-ref="headerRef"
      icon="group"
      label="Members"
      group="group"
    >
      <div
        v-for="member in group.members"
        :key="member.id"
        class="p-2"
      >
        <q-item
          v-ripple
          class="rounded"
        >
          <q-item-section
            avatar
          >
            <q-avatar :style="{backgroundColor: group.color}">
              <UserImage
                :user="member"
              />
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
        </q-item>
      </div>
    </ExpansionItem>

    <ExpansionItem
      :header-ref="headerRef"
      :caption="`${group.textChannels.length} available`"
      default-opened
      icon="chat"
      label="Text Channel"
      group="group"
    >
      <div class="px-2 pt-2">
        <q-btn
          v-if="user?.id === group.owner.id"
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
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType } from 'vue'
import { useQuasar } from 'quasar'

// components
import TextChannel from 'src/components/dialogs/channels/TextChannel.vue'
import VoiceChannel from 'src/components/dialogs/channels/VoiceChannel.vue'
import ExpansionItem from './ExpansionItem.vue'
import UserImage from '../../reusables/UserImage.vue'

// models
import { Group } from 'src/models/Group'
import { storeToRefs } from 'pinia'
import { useAuthUser } from 'src/stores/auth-user'

// stores

// utils

export default defineComponent({
  components: { ExpansionItem, UserImage },
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
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

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
      manageCreateChannelDialog,
      user
    }
  }
})
</script>
