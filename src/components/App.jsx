import React from 'react'
import { useState, useRef } from 'react'
import Peer from 'skyway-js'
const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY })
const App = () => {
    const [myId, setMyId] = useState('')
    const [callId, setCallId] = useState('')
    const localVideo = useRef(null)
    const remoteVideo = useRef(null)
    peer.on('open', () => {
      setMyId(peer.id)
      if (localVideo.current !== null) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(localStream => {
          localVideo.current.srcObject = localStream
        })
      }
    })

    peer.on('call', mediaConnection => {
      if (localVideo.current !== null) {
        mediaConnection.answer(localVideo.current.srcObject)

        mediaConnection.on('stream', async stream => {
          remoteVideo.current.srcObject = stream
        })
      }
    })

    const makeCall = () => {
      const mediaConnection = peer.call(callId, localVideo.current.srcObject)
      mediaConnection.on('stream', async stream => {
        remoteVideo.current.srcObject = stream
        await remoteVideo.current.play().catch(console.error)
      })
    }
    return (
      <div>
        <div>skyway test</div>
        <div><video width="400px" autoPlay muted playsInline ref={localVideo}></video></div>
        <div>{myId}</div>
        <div>
          <input value={callId} onChange={e => setCallId(e.target.value)}></input>
          <button onClick={makeCall}>発信</button>
        </div>
        <div><video width="400px" autoPlay muted playsInline ref={remoteVideo}></video></div>
      </div>
    )
}

export default App