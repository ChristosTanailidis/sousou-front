/* eslint-disable no-undef */
import { defineStore, storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// interfaces
import { PersonalMessage } from 'src/models/PersonalMessage'
import { useAuthUser } from './auth-user'

const PEER_CONNECTION_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

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
      ringingSound: new Audio('/sounds/ring-sound.mp3'),
      callingSound: new Audio('/sounds/calling-sound.mp3')
    }
  }),
  getters: {
    inCallWithUser: (state) => {
      const userStore = useAuthUser()
      const { personalChats } = storeToRefs(userStore)
      return personalChats.value.find(pc => pc.id === state.personalChatId || state.callingMessage?.personalChat.id)?.users[0]
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
    },

    async callSetup () {
      this.peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONFIG)

      this.audioMedia = await navigator.mediaDevices.getUserMedia(
        { audio: true, video: false }
      )

      this.audioMedia?.getTracks().forEach(track => {
        if (this.audioMedia) {
          this.peerConnection?.addTrack(track, this.audioMedia)
        }
      })

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
    },

    async startCall () {
      if (!this.peerConnection) {
        return
      }

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

      socket.emit('answer-call-one-to-one', { ...data })
    },

    async receiveAnswer (answer?: boolean, description?: RTCSessionDescriptionInit) {
      if (answer) {
        if (!description) {
          throw Error('No description was provided from the answered call')
        }

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
      if (this.peerConnection) {
        this.peerConnection?.close()
        this.peerConnection = undefined
      }

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
    }
  }
})