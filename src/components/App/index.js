import { useRef, useState } from "react"

import Peer from "skyway-js"
import React from "react"

const peer = new Peer({ key: API_KEY })

const App = () => {
  const [myId, setMyId] = useState("")
  const [callId, setCallId] = useState("")
  const localVideo = useRef(null)
  const remoteVideo = useRef(null)

  peer.on("open", () => {
    setMyId(peer.id)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        localVideo.current.srcObject = localStream
      })
  })

  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localVideo.current.srcObject)
    mediaConnection.on("stream", async (stream) => {
      remoteVideo.current.srcObject = stream
    })
  })

  const makeCall = () => {
    const mediaConnection = peer.call(callId, localVideo.current.srcObject)
    mediaConnection.on("stream", async (stream) => {
      remoteVideo.current.srcObject = stream
      await remoteVideo.current.play().catch(console.error)
    })
  }

  return (
    <div>
      <h1>Treasure Voice</h1>

      <div>
        <video
          width="400px"
          autoPlay
          muted
          playsInline
          ref={localVideo}
        ></video>
      </div>
      <div>{myId}</div>
      <div>
        <input
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
        ></input>
        <button onClick={makeCall}>Call</button>
      </div>
      <div>
        <video
          width="400px"
          autoPlay
          muted
          playsInline
          ref={remoteVideo}
        ></video>
      </div>
    </div>
  )
}

export default App
