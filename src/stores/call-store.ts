/* eslint-disable no-undef */
import { defineStore, storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// interfaces
import { PersonalMessage } from 'src/models/PersonalMessage'
import { useAuthUser } from './auth-user'

const PEER_CONNECTION_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302'
        // 'stun:stun1.l.google.com:19302',
        // 'stun:stun2.l.google.com:19302',
        // 'stun:stun3.l.google.com:19302',
        // 'stun:stun4.l.google.com:19302'
      ]
    }
    // {
    //   urls: ['turn:192.158.29.39:3478?transport=udp', 'turn:192.158.29.39:3478?transport=tcp'],
    //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //   username: '28224511:1379330808'
    // }
    // {
    //   url: 'turn:192.158.29.39:3478?transport=tcp',
    //   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //   username: '28224511:1379330808'
    // }
  ]
}

export const useCallStore = defineStore('call-store', {
  state: () => ({
    // Call state identifiers
    onCall: false,
    ringing: false,
    callType: undefined as 'caller' | 'receiver' | undefined,

    // WebRTC related objects
    remoteOffer: undefined as RTCSessionDescriptionInit | undefined,
    peerConnection: undefined as RTCPeerConnection | undefined,
    audioMedia: undefined as MediaStream | undefined,
    remoteDescriptionIsSet: false,

    // Socket related objects
    callingMessage: undefined as PersonalMessage | undefined,
    callingMessageId: undefined as string | undefined,
    personalChatId: undefined as string | undefined,

    // Audio Controls
    audio: undefined as HTMLMediaElement | undefined,
    volumeLevel: 1,
    previousVolumeLevel: 1,
    micMuted: false,

    callSounds: {
      ringingSound: new Audio('/sounds/Receiver.mp3'),
      callingSound: new Audio('/sounds/Caller.mp3')
    }
  }),
  getters: {
    inCallWithUser: (state) => {
      const userStore = useAuthUser()
      const { personalChats } = storeToRefs(userStore)
      return personalChats.value.find(pc => pc.id === (state.personalChatId || state.callingMessage?.personalChat.id))?.users[0]
    }
  },
  actions: {
    initiateCall (personalChatId: string) {
      this.personalChatId = personalChatId
      this.callType = 'caller'
      this.ringing = true
    },

    receiveCall (personalMessage: PersonalMessage, description: RTCSessionDescriptionInit) {
      this.ringing = true

      this.personalChatId = personalMessage.personalChat.id
      this.callType = 'receiver'

      this.callingMessage = personalMessage
      this.remoteOffer = description

      setTimeout(() => {
        this.callSounds.ringingSound.play()
      }, 500)
    },

    async callSetup () {
      this.peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG)

      if (this.peerConnection) {
        this.peerConnection.onicecandidate = (event?: RTCPeerConnectionIceEvent) => {
          socket.emit('send-candidate', { personalChatId: this.callType === 'caller' ? this.personalChatId : this.callingMessage?.personalChat.id, candidate: event?.candidate })
        }

        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
          if (this.audio && this.audio.srcObject !== event.streams[0]) {
            this.audio.srcObject = event.streams[0]
          }
        }
      }

      this.audioMedia = await navigator.mediaDevices.getUserMedia(
        { audio: true, video: false }
      )

      this.audioMedia?.getTracks().forEach(track => {
        if (this.audioMedia) {
          this.peerConnection?.addTrack(track, this.audioMedia)
        }
      })
    },

    async startCall () {
      if (!this.peerConnection) {
        return
      }

      setTimeout(() => {
        this.callSounds.callingSound.play()
      }, 300)

      const callerOffer = await this.peerConnection?.createOffer()
      await this.peerConnection.setLocalDescription(callerOffer)

      socket.emit('send-voice-one-to-one', { description: callerOffer, personalChatId: this.personalChatId }, (data: { callMessageId: string }) => {
        this.callingMessageId = data.callMessageId
      })
    },

    async answerCall (answer: boolean) {
      let data = {}

      if (answer) {
        if (!this.peerConnection || !this.remoteOffer) {
          return
        }

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.remoteOffer))
        this.remoteDescriptionIsSet = true

        const answer = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(answer)

        data = { callMessageId: this.callingMessage?.id, answer: true, description: answer }

        this.onCall = true
        this.ringing = false
      } else {
        data = { callMessageId: this.callingMessage?.id, answer: false }
      }

      this.callSounds.callingSound.pause()
      this.callSounds.callingSound.currentTime = 0

      socket.emit('answer-call-one-to-one', { ...data })
    },

    async receiveAnswer (answer?: boolean, description?: RTCSessionDescriptionInit) {
      this.callSounds.callingSound.pause()
      this.callSounds.callingSound.currentTime = 0
      if (answer) {
        if (!description) {
          throw Error('No description was provided from the answered call')
        }

        this.remoteOffer = description
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(description))
        this.remoteDescriptionIsSet = true

        this.onCall = true
        this.ringing = false
      } else {
        this.clearCall()
      }

      this.ringing = false
    },

    hangUp () {
      socket.emit('end-call-one-to-one', { callMessageId: this.callingMessage?.id || this.callingMessageId })
    },

    changeSoundVolume () {
      if (!this.audio) {
        return
      }

      if (this.audio.volume > 0) {
        this.previousVolumeLevel = this.audio.volume
        this.audio.volume = 0
      } else {
        this.audio.volume = this.previousVolumeLevel || 0
      }

      this.volumeLevel = this.audio.volume
    },

    changeMicState () {
      if (!this.audioMedia) {
        return
      }

      this.audioMedia.getAudioTracks()[0].enabled = this.micMuted
      this.micMuted = !this.micMuted
    },

    clearCall () {
      if (this.peerConnection) {
        this.peerConnection.close()
        this.peerConnection = undefined
      }

      this.onCall = false
      this.ringing = false
      this.callType = undefined

      this.remoteOffer = undefined
      this.peerConnection = undefined
      this.audioMedia = undefined
      this.remoteDescriptionIsSet = false

      this.callingMessage = undefined
      this.callingMessageId = undefined
      this.personalChatId = undefined

      this.callSounds.callingSound.pause()
      this.callSounds.callingSound.currentTime = 0

      this.callSounds.ringingSound.pause()
      this.callSounds.ringingSound.currentTime = 0
    }
  }
})
