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
import { defineComponent, PropType, ref, onMounted } from 'vue'
// import SimplePeer from 'simple-peer'
// import wrtc from 'wrtc'

// components
import UserImage from '../reusables/UserImage.vue'

// models
import { User } from 'src/models/User'
import { socket } from 'src/boot/socket_io'
import { useAuthUser } from 'src/stores/auth-user'
import { storeToRefs } from 'pinia'

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
  setup (props) {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const audio2 = ref<any>()
    // const peerRef = ref<SimplePeer.Instance | null>(null)

    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false
    }
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

    const pc1: RTCPeerConnection = new RTCPeerConnection(configuration)

    let audioMedia = null

    let fromUser = null

    const startCall = async () => {
      console.log('startCall')

      // pc2 = new RTCPeerConnection(configuration)
      // console.log('Created remote peer connection object pc2')
      // pc2.onicecandidate = async (e) => {
      //   if (!e.candidate) { return }
      //   console.log('pc1 addicecandidate')
      //   await pc1.addIceCandidate(e.candidate)
      // }

      console.log('Requesting local stream')

      const pc1Desc = await pc1.createOffer(offerOptions)

      console.log(`Offer from pc1\n${pc1Desc.sdp}`)
      await pc1.setLocalDescription(pc1Desc)

      socket.emit('1st-send-voice-one-to-one', { description: pc1Desc, toUserId: props.friend.id })
    }

    let flag = false

    onMounted(async () => {
      audioMedia = await navigator.mediaDevices.getUserMedia(
        { audio: true }
      )

      const audioTracks = audioMedia.getAudioTracks()
      if (audioTracks.length > 0) {
        console.log(`Using Audio device: ${audioTracks[0].label}`)
      }

      audioMedia.getTracks().forEach(track => pc1.addTrack(track, audioMedia))

      // eslint-disable-next-line no-undef
      socket.on('answer-call-one-to-one', async (data: { description: RTCSessionDescriptionInit, fromUserId: string}) => {
        console.log('geia ')
        fromUser = data.fromUserId

        await pc1.setRemoteDescription(data.description)

        const pc2Desc = await pc1.createAnswer()

        console.log(`Answer from pc2\n${pc2Desc.sdp}`)
        await pc1.setLocalDescription(pc2Desc)

        socket.emit('answered-one-to-one', { description: pc2Desc, toUserId: data.fromUserId })
      })

      // eslint-disable-next-line no-undef
      socket.on('call-accepted-one-to-one', async (data: { description: RTCSessionDescriptionInit, fromUserId: string }) => {
        await pc1.setRemoteDescription(data.description)
      })

      pc1.ontrack = async (e) => {
        if (audio2.value.srcObject !== e.streams[0]) {
          audio2.value.srcObject = e.streams[0]
          console.log('Received remote stream')
        }
      }

      console.log('audioMedia', audioMedia)

      console.log('Created local peer connection object pc1')
      pc1.onicecandidate = async (e) => {
        if (!e.candidate) { return }
        console.log('pc2 addicecandidate', e)

        setTimeout(() => {
          if (!flag) {
            socket.emit('send-candidate', { toUserId: fromUser || props.friend.id, candidate: e.candidate })
            flag = true
          }
        }, 3000)
      }

      socket.on('receive-candidate', async (data: {fromUserId: string, candidate: RTCIceCandidate }) => {
        await pc1.addIceCandidate(data.candidate)
      })
    })

    const endCall = () => {
    //   if (peerRef.value) {
    //     peerRef.value.destroy()
    //     peerRef.value = null
    //   }
      console.log('Ending call')

      pc1.close()
      pc1.close()
    }

    return {
      audio2,
      startCall,
      endCall
    }
  }
})
</script>
