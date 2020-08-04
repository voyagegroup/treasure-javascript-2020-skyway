import React, { useRef, useState } from 'react'
import Peer from 'skyway-js'
import Editor from './Editor'

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY })
const VideoChat = () => {
  console.log('start VideoChat')
  const [myId, setMyId] = useState('')
  const [callId, setCallId] = useState('')
  const [dataConnection, setDataConnection] = useState('')
  const [editText, setEditText] = useState('')
  const localVideo = useRef(null)
  const remoteVideo = useRef(null)


  // 最初だけ
  peer.on('open', () => {
    console.log('open')
    setMyId(peer.id)
    // useEffectを使うべきかもしれない
    if (localVideo.current !== null) {
      console.log('get localStream');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(localStream => {
        localVideo.current.srcObject = localStream
      })
    }
  })

  /* 接続要求を送信 */
  const makeConnection = () => {
    console.log('make Call')
    const mediaConnection = peer.call(callId, localVideo.current.srcObject)
    mediaConnection.on('stream', async stream => {
      remoteVideo.current.srcObject = stream
      await remoteVideo.current.play().catch(console.error)
    })
    console.log("makeConnect")
    const dataConnection = peer.connect(callId);
    setDataConnection(dataConnection) //Connいる?

    dataConnection.on('data', data => {
      console.log(data);
      setEditText(data)
    });
  }


  /* 接続要求を受信時 */
  peer.on('connection', receiveDataConnection => {
    console.log('peer.on conection')
    /* 初期接続時 */
    console.log("setConn");
    setDataConnection(receiveDataConnection);

    /* メッセージ受信 */
    receiveDataConnection.on('data', data => {
      console.log(data);
      setEditText(data)
    });
  })

  /* ビデオ電話要求を受信 */
  peer.on('call', mediaConnection => {
    // useEffectを使うべきかもしれない
    if (localVideo.current !== null) {
      mediaConnection.answer(localVideo.current.srcObject)

      mediaConnection.on('stream', async stream => {
        remoteVideo.current.srcObject = stream
      })
    }
  })

  /* メッセージを送信時 */
  const send = () => {
    dataConnection.send(editText);
  }

  return (
    <>
      <div style={{ display: "flex", height: "300px"}}>
        {console.log('start return ')}
        {console.log("editText:", editText)}
        <div>
          <video width="300px" autoPlay muted playsInline ref={localVideo}></video>
          <div>{myId}</div>
          <input onChange={e => setCallId(e.target.value)}></input>
          <button onClick={makeConnection}>発信</button>
        </div>
        <div>
          <video width="300px" autoPlay muted playsInline ref={remoteVideo}></video>
        </div>
      </div>
      <button onClick={send}>メッセージ送信</button>
      <Editor text={editText} setEditText={setEditText}/>
    </>
  )
}

export default VideoChat