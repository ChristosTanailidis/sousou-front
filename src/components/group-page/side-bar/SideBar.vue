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
      <div
        v-for="member in group.members"
        :key="member.id"
        class="p-2"
      >
        <q-item
          v-ripple
          clickable
          dense
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

          <MemberProperties />
        </q-item>
      </div>
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

        <q-item-section>
          <audio
            id="audio"
            ref="audio"
            autoplay
            controls
          />
        </q-item-section>

        <q-item-section>
          <q-btn
            icon="call"
            @click="joinCall(voiceChannel.id)"
          />
        </q-item-section>
      </q-item>
    </ExpansionItem>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, onMounted, PropType, ref } from 'vue'
import { useQuasar } from 'quasar'

import Peer from 'peerjs'

// components
import TextChannel from 'src/components/dialogs/channels/TextChannel.vue'
import VoiceChannel from 'src/components/dialogs/channels/VoiceChannel.vue'
import ExpansionItem from './ExpansionItem.vue'
import MemberProperties from '../../reusables/MemberProperties.vue'
import UserImage from '../../reusables/UserImage.vue'

// models
import { Group } from 'src/models/Group'
import { socket } from 'src/boot/socket_io'

// stores

// utils

export default defineComponent({
  components: { ExpansionItem, MemberProperties, UserImage },
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

    const audio = ref<HTMLMediaElement>()

    const peer = new Peer()
    let localStream: MediaStream

    let peerId: string
    let myPeerId: string

    const joinCall = (voiceChannelId: string) => {
      console.log('joinCall', peer, peerId)

      if (peerId) {
        const connection = peer.connect(peerId)

        connection.on('open', async () => {
          console.log('Connected to peer: ' + connection.peer)

          localStream = await navigator.mediaDevices.getUserMedia({ audio: true })

          localStream.getTracks().forEach(track => connection.send(track))
          // Send data to the peer
          // connection.send({ audioTrack: localStream })

          if (audio.value) {
            audio.value.srcObject = localStream
          }
        })
        return
      }

      socket.emit('signal', { voiceChannelId, signal: myPeerId })
    }

    onMounted(() => {
      // Listen for the 'open' event to get the generated ID for the current peer
      peer.on('open', (newPeerId) => {
        myPeerId = newPeerId
        console.log('My peer ID is: ' + myPeerId)
      })

      peer.on('connection', (connection) => {
        console.log('on connection kati na kseroume pou emfanizetai', connection)
        connection.on('data', (data) => {
          console.log('Data received from ' + connection.peer + ': ' + data)

          // Handle data received from the peer
          console.log('Data received from ' + connection.peer + ': ' + data)

          if (audio.value) {
            audio.value.srcObject = data.audioStream
          }
        })
      })

      socket.on('signal', async (data: { voiceChannel: string, source: string, signal: any }) => {
        console.log('SIGNAL ON', data)
        peerId = data.signal
      })

      // Listen for incoming connections
      // peer.on('connection', (connection) => {
      //   console.log('Incoming connection from: ' + connection.peer)

      //   // Handle data received from the peer
      //   connection.on('data', (data) => {
      //     console.log('Data received from ' + connection.peer + ': ' + data)
      //   })

      //   // Send data to the peer
      //   connection.send('Hello from the server!')
      // })
    })

    return {
      manageCreateChannelDialog,
      joinCall,
      audio
    }
  }
})
</script>
