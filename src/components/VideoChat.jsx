import React from 'react'
import { useState } from 'react'
import Peer from 'skyway-js'

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY })
const VideoChat = () => {
  const [myId, setMyId] = useState('')
  const [callId, setCallId] = useState('')
  const [dataConnection, setDataConnection] = useState('')
  const [message, setMessage] = useState('')
  // const localVideo = useRef(null)
  // const remoteVideo = useRef(null)


  // 最初だけ
  peer.on('open', () => {
    console.log('open')
    setMyId(peer.id)
  })

  /* 接続要求を送信時 */
  const makeConnect = () => {
    console.log("makeConnect")
    const dataConnection = peer.connect(callId);
    setDataConnection(dataConnection) //Connいる?

    dataConnection.on('data', data => {
      console.log(data);
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
    });
  })

  /* メッセージを送信時 */
  const send = () => {
    dataConnection.send(message);
  }

  return (
    <div style={{ display: "flex", height: "400px"}}>
      {console.log('start return ')}
      <div>
        <div>{myId}</div>
        <input onChange={e => setCallId(e.target.value)}></input>
        <button onClick={makeConnect}>発信</button>
        <input onChange={e => setMessage(e.target.value)}></input>
        <button onClick={send}>メッセージ送信</button>

      </div>
    </div>
    )
}

export default VideoChat