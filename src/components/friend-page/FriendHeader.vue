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
      <audio
        id="audio2"
        ref="audio2"
        autoplay
        controls
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
// import SimplePeer from 'simple-peer'
// import wrtc from 'wrtc'

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
    const audio2 = ref<any>()
    // const peerRef = ref<SimplePeer.Instance | null>(null)

    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false
    }

    let pc1: RTCPeerConnection, pc2: RTCPeerConnection

    const startCall = async () => {
      console.log('startCall')

      const audioMedia = await navigator.mediaDevices.getUserMedia(
        { audio: true }
      )

      console.log('audioMedia', audioMedia)

      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

      pc1 = new RTCPeerConnection(configuration)
      console.log('Created local peer connection object pc1')
      pc1.onicecandidate = async (e) => {
        if (!e.candidate) { return }
        await pc2.addIceCandidate(e.candidate)
      }

      pc2 = new RTCPeerConnection(configuration)
      console.log('Created remote peer connection object pc2')
      pc2.onicecandidate = async (e) => {
        if (!e.candidate) { return }
        await pc1.addIceCandidate(e.candidate)
      }

      pc2.ontrack = async (e) => {
        if (audio2.value.srcObject !== e.streams[0]) {
          audio2.value.srcObject = e.streams[0]
          console.log('Received remote stream')
        }
      }
      console.log('Requesting local stream')

      const audioTracks = audioMedia.getAudioTracks()
      if (audioTracks.length > 0) {
        console.log(`Using Audio device: ${audioTracks[0].label}`)
      }
      audioMedia.getTracks().forEach(track => pc1.addTrack(track, audioMedia))

      const pc1Desc = await pc1.createOffer(offerOptions)

      console.log(`Offer from pc1\n${pc1Desc.sdp}`)
      await pc1.setLocalDescription(pc1Desc)

      await pc2.setRemoteDescription(pc1Desc)
      const pc2Desc = await pc2.createAnswer()
      console.log(`Answer from pc2\n${pc2Desc.sdp}`)
      await pc2.setLocalDescription(pc2Desc)
      await pc1.setRemoteDescription(pc2Desc)
    }

    const endCall = () => {
    //   if (peerRef.value) {
    //     peerRef.value.destroy()
    //     peerRef.value = null
    //   }
      console.log('Ending call')

      pc1.close()
      pc2.close()
    }

    return {
      audio2,
      startCall,
      endCall
    }
  }
})
</script>
