<template>
  <q-dialog
    ref="dialogRef"
    position="top"
    seamless
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        {{ personalChatId ? 'Calling...' : 'Someone is calling you' }}
      </q-card-section>

      <q-card-section>
        <audio
          id="audio"
          ref="audio"
          autoplay
          controls
        />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          v-if="!personalChatId"
          color="primary"
          label="Answer"
          @click="answerCall(true)"
        />
        <q-btn
          color="primary"
          label="Hang up"
          @click="answerCall(false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { socket } from 'src/boot/socket_io'

// components

// models
import { PersonalChat } from 'src/models/PersonalChat'
import { PersonalMessage } from 'src/models/PersonalMessage'

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    personalChatId: {
      type: String,
      default: undefined
    },
    callingMessage: {
      type: Object as PropType<PersonalMessage>,
      default: undefined
    },
    description: {
      // eslint-disable-next-line no-undef
      type: Object as PropType<RTCSessionDescriptionInit>,
      default: undefined
    },
    type: {
      type: String as PropType<'caller' | 'receiver'>,
      default: 'receiver'
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const audio = ref<HTMLMediaElement>()

    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    const connection: RTCPeerConnection = new RTCPeerConnection(configuration)

    let audioMedia: MediaStream
    let callersPersonalChat: PersonalChat
    let callerMessageId: string

    onMounted(async () => {
      audioMedia = await navigator.mediaDevices.getUserMedia(
        { audio: true }
      )

      audioMedia.getTracks().forEach(track => connection.addTrack(track, audioMedia))

      const callerDescription = await connection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      })

      await connection.setLocalDescription(callerDescription)

      if (props.personalChatId && props.type === 'caller') {
        socket.emit('send-voice-one-to-one', { description: callerDescription, personalChatId: props.personalChatId }, (data: { callMessageId: string }) => {
          callerMessageId = data.callMessageId
          console.log('tsikoulata', data.callMessageId)
        })
      }

      connection.onicecandidate = async (e) => {
        if (!e.candidate) {
          return
        }

        socket.emit('send-candidate', { personalChatId: props.type === 'caller' ? props.personalChatId : props.callingMessage?.personalChat.id, candidate: e.candidate })
      }

      // eslint-disable-next-line no-undef
      socket.on('answer-call-one-to-one', async (data: { description?: RTCSessionDescriptionInit, callMessage?: PersonalMessage, answer?: boolean, err?: string }) => {
        if (data.err) {
          console.log('ERROR --- ', data.err)
          return
        }

        if (data.answer === false) {
          onDialogCancel()
        }

        if (!data.description) {
          return
        }

        console.log('edw pera')

        await connection.setRemoteDescription(data.description)
      })

      socket.on('receive-candidate', async (data: {personalChat: PersonalChat, candidate: RTCIceCandidate }) => {
        callersPersonalChat = data.personalChat

        if (!data.candidate) {
          return
        }

        try {
          await connection.addIceCandidate(data.candidate)
        } catch (err) {
          console.log('error', err, data)
        }
      })

      connection.ontrack = async (e) => {
        if (audio.value && audio.value.srcObject !== e.streams[0]) {
          audio.value.srcObject = e.streams[0]
        }
      }

      socket.on('end-call-one-to-one', async () => {
        await connection.close()
        endCall()
      })
    })

    const answerCall = async (answer = true) => {
      console.log('answer is:', answer, 'also', props.callingMessage, !props.description)

      if (!answer) {
        if (props.type === 'caller') {
          endCall()
        }
      }

      if (!props.callingMessage || !props.description) {
        return
      }

      if (!answer) {
        socket.emit('answer-call-one-to-one', { callMessageId: props.callingMessage.id, answer })
        endCall() // todo: lathos
      }

      await connection.setRemoteDescription(props.description)

      const receiverDescription = await connection.createAnswer()
      await connection.setLocalDescription(receiverDescription)

      socket.emit('answer-call-one-to-one', { description: receiverDescription, callMessageId: props.callingMessage.id, answer })
    }

    const endCall = async () => {
      audioMedia.getTracks().forEach(track => track.stop()) // todo: den doulevei
      socket.emit('end-call-one-to-one', { callMessageId: props.callingMessage?.id || callerMessageId })
      await connection.close()

      onDialogCancel()
    }

    return {
      audio,
      answerCall,
      endCall,

      dialogRef,
      onDialogHide,

      onOKClick () {
        onDialogOK()
      }
    }
  }
})
</script>
