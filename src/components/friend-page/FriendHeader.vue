<template>
  <div
    class="flex flex-nowrap items-center gap-4 h-[80px] border-b-2 border-primary"
  >
    <div>
      <q-avatar
        class="h-[78px] w-[78px]"
        square
      >
        <UserImage
          :user="friend"
          text-size="4rem"
        />
      </q-avatar>
    </div>

    <div class="text-xl font-semibold self-start my-1">
      <div class="flex flex-col gap-2 justify-center">
        <div class="flex flex-nowrap gap-1">
          <div>
            {{ friend.displayName }}
          </div>

          <div class="font-thin">
            #{{ friend.code }}
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
        icon="phone_in_talk"
        color="primary"
        @click="startCall"
      />
      <q-btn
        flat
        round
        unelevated
        icon="phone_in_talk"
        color="red"
        @click="endCall"
      />
      <q-btn
        flat
        round
        unelevated
        icon="settings"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import SimplePeer from 'simple-peer'
import wrtc from 'wrtc'

// components
import UserImage from '../reusables/UserImage.vue'

// models
import { User } from 'src/models/User'

// stores

// utils

export default defineComponent({
  components: { UserImage },
  props: {
    friend: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup () {
    const peerRef = ref<SimplePeer.Instance | null>(null)

    const startCall = () => {
      const peer = new SimplePeer({
        initiator: true,
        wrtc
      })

      peer.on('signal', (data) => {
        // Send the signal data to the other peer
      })

      peer.on('connect', () => {
        // Connection established
        // Call the other peer when the connection is established
        if (peer && !peer.destroyed) {
          const getUserMedia = navigator.mediaDevices.getUserMedia
          getUserMedia(
            { audio: true }
          ).then((stream) => {
            const call = peerRef.value.call(null, stream)
            call.on('stream', (remoteStream) => {
              // Remote audio stream received
            })
          }).catch((error) => {
            console.error('getUserMedia error:', error)
          })
        }
      })

      peer.on('data', (data) => {
        // Receive audio data from other peer
      })

      peer.on('close', () => {
        // Connection closed
      })

      this.peer = peer
    }

    const endCall = () => {
      if (peerRef.value) {
        peerRef.value.destroy()
        peerRef.value = null
      }
    }

    return {
      startCall,
      endCall
    }
  }
})
</script>
