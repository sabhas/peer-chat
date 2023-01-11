import React, { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AgoraRTM from 'agora-rtm-sdk'
import { v4 as uuidv4 } from 'uuid'
import { useDidMount } from '../../hooks/use-did-mount'
import cameraIcon from '../../icons/camera.png'
import micIcon from '../../icons/mic.png'
import phoneIcon from '../../icons/phone.png'
import './index.css'

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ]
}

const constraints = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 }
  },
  audio: true
}

const commonPropsForVideoTag = {
  className: 'video-player',
  autoPlay: true,
  playsInline: true
}

const APP_ID = import.meta.env.VITE_API_ID

export const Room = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  if (!roomId) navigate('/')

  const user1 = useRef<HTMLVideoElement>(null)
  const user2 = useRef<HTMLVideoElement>(null)
  const cameraBtn = useRef<HTMLDivElement>(null)
  const micBtn = useRef<HTMLDivElement>(null)
  const leaveBtn = useRef<HTMLDivElement>(null)

  const client = AgoraRTM.createInstance(APP_ID)
  const channel = client.createChannel(roomId!)
  let localStream: MediaStream
  let remoteStream: MediaStream
  let peerConnection: RTCPeerConnection

  useDidMount(async () => {
    const uid = uuidv4()

    await client.login({ uid })

    await channel.join()

    channel.on('MemberJoined', handleUserJoined)
    channel.on('MemberLeft', handleUserLeft)
    client.on('MessageFromPeer', handleMessageFromPeer)

    localStream = await navigator.mediaDevices.getUserMedia(constraints)
    user1.current!.muted = true
    user1.current!.srcObject = localStream
  })

  const createPeerConnection = async (memberId: string) => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    user2.current!.srcObject = remoteStream
    user2.current!.style.display = 'block'
    user1.current!.classList.add('smallFrame')

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      user1.current!.srcObject = localStream
    }

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track)
      })
    }

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: 'candidate',
              candidate: event.candidate
            })
          },
          memberId
        )
      }
    }
  }

  const handleMessageFromPeer = async (message: any, memberId: string) => {
    message = JSON.parse(message.text)

    if (message.type === 'offer') {
      await createAnswer(memberId, message.offer)
    }

    if (message.type === 'answer') {
      await addAnswer(message.answer)
    }

    if (message.type === 'candidate') {
      if (peerConnection) {
        await peerConnection.addIceCandidate(message.candidate)
      }
    }
  }

  const handleUserJoined = async (memberId: string) => {
    console.log('A new user joined the channel:', memberId)
    await createOffer(memberId)
  }

  const createOffer = async (memberId: string) => {
    await createPeerConnection(memberId)

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    await client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'offer', offer: offer }) },
      memberId
    )
  }

  const createAnswer = async (
    memberId: string,
    offer: RTCSessionDescriptionInit
  ) => {
    await createPeerConnection(memberId)

    await peerConnection.setRemoteDescription(offer)

    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    await client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'answer', answer: answer }) },
      memberId
    )
  }

  const addAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnection.currentRemoteDescription) {
      await peerConnection.setRemoteDescription(answer)
    }
  }

  const handleUserLeft = () => {
    user2.current!.style.display = 'none'
    user1.current!.classList.remove('smallFrame')
  }

  const leaveChannel = async () => {
    localStream.getTracks().forEach((track) => {
      track.stop()
    })
    await channel.leave()
    await client.logout()
    navigate('/')
  }

  const toggleCamera = async () => {
    const videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === 'video')

    if (!videoTrack) return

    if (videoTrack.enabled) {
      videoTrack.enabled = false
      cameraBtn.current!.style.backgroundColor = 'rgb(255, 80, 80)'
    } else {
      videoTrack.enabled = true
      cameraBtn.current!.style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
  }

  const toggleMic = async () => {
    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === 'audio')

    if (!audioTrack) return

    if (audioTrack.enabled) {
      audioTrack.enabled = false
      micBtn.current!.style.backgroundColor = 'rgb(255, 80, 80)'
    } else {
      audioTrack.enabled = true
      micBtn.current!.style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
  }

  return (
    <>
      <div id='videos'>
        <video {...commonPropsForVideoTag} id='user-1' ref={user1}></video>
        <video {...commonPropsForVideoTag} id='user-2' ref={user2}></video>
      </div>

      <div id='controls'>
        <div
          className='control-container'
          id='camera-btn'
          ref={cameraBtn}
          onClick={toggleCamera}
        >
          <img src={cameraIcon} />
        </div>

        <div
          className='control-container'
          id='mic-btn'
          ref={micBtn}
          onClick={toggleMic}
        >
          <img src={micIcon} />
        </div>

        <div
          className='control-container'
          id='leave-btn'
          ref={leaveBtn}
          onClick={leaveChannel}
        >
          <img src={phoneIcon} />
        </div>
      </div>
    </>
  )
}
