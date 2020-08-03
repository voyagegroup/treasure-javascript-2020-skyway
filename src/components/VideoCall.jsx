import React from 'react'
import { useState, useRef } from 'react'
import Peer from 'skyway-js'
import connectImage from '../img/connect.png'

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY })
const VideoCall = () => {
  console.log('start VideoCall---------: 0');

  const [myId, setMyId] = useState('')
  const [callId, setCallId] = useState('')
  const localVideo = useRef(null)
  const remoteVideo = useRef(null)

  /* 初期接続時 */
  peer.on('open', () => {
    console.log('start peer.on');
    setMyId(peer.id)
    if (localVideo.current !== null) {
      console.log('get localStream');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(localStream => {
        localVideo.current.srcObject = localStream
      })
    }
    console.log('end peer.on');
  })

  /* ビデオ電話要求を受信 */
  peer.on('call', mediaConnection => {
    console.log('peer.on call!!')
    if (localVideo.current !== null) {
      mediaConnection.answer(localVideo.current.srcObject)

      mediaConnection.on('stream', async stream => {
        remoteVideo.current.srcObject = stream
      })
    }
  })

    const makeCall = () => {
      console.log('make Call')
      const mediaConnection = peer.call(callId, localVideo.current.srcObject)
      mediaConnection.on('stream', async stream => {
        remoteVideo.current.srcObject = stream
        await remoteVideo.current.play().catch(console.error)
      })
    }
  return (
    <div style={{ display: "flex", height: "400px"}}>
      {console.log('start return ')}
      <div>
        <video width="300px" autoPlay muted playsInline ref={localVideo}></video>
        <div>{myId}</div>
        <input value={callId} onChange={e => setCallId(e.target.value)}></input>
        <button onClick={makeCall}>発信</button>
      </div>
        {/* <img src={connectImage} alt="img of connectImage" width="300px"/> */}
      <div>
        <video width="300px" autoPlay muted playsInline ref={remoteVideo}></video>
      </div>
    </div>
    )
}

export default VideoCall