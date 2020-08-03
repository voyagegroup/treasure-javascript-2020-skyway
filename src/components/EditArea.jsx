    // import 'ace-builds/src-noconflict/ace';
    // import 'ace-builds/src-noconflict/mode-c_cpp';
    // import 'ace-builds/src-noconflict/theme-chaos';
    // import React from 'react';
    // import AceEditor from 'react-ace';

    // const EditArea = React.memo(
    // (props) => {
    //     let editorInstance = null;

    //     const onChange = () => {
    //     console.log(editorInstance.getValue());
    //     };
    //     /* editorInstance作成後 */
    //     const onLoad = (newEditorInstance) => {
    //     editorInstance = newEditorInstance;
    //     };

    //     return (
    //     <div className="bg-gray-900 flex-auto">
    //         <h2>Share Code</h2>
    //         <AceEditor
    //         editorProps={{ $blockScrolling: 'true' }}
    //         fontSize="16px"
    //         height="500px"
    //         highlightActiveLine={false}
    //         mode="c_cpp"
    //         name="UNIQUE_ID_OF_DIV"
    //         onChange={onChange}
    //         onLoad={onLoad}
    //         showPrintMargin={false}
    //         tabSize={4}
    //         theme="chaos"
    //         width="100%"
    //         wrapEnabed={false}
    //         />
    //     </div>
    //     );
    // },
    // // Props.initialTextが変更されない限り, 再レンダリングしない
    // //   (prevProps, nextProps) => prevProps.initialText === nextProps.initialText,
    // );


    // export default EditArea;

import React from 'react'
import { useState } from 'react'
import Peer from 'skyway-js'

const peer = new Peer({ key: process.env.REACT_APP_SKYWAY_KEY })
const VideoCall = () => {
  const [myId, setMyId] = useState('')
  const [conn, setConn] = useState('')
  const [callId, setCallId] = useState('')
  const [message, setMessage] = useState('')

  // 最初だけ
  peer.on('open', () => {
    console.log('open')
    setMyId(peer.id)
  })

  /* 接続要求を送信時 */
  const makeConnect = () => {
    console.log("makeConnect")
    const dataConnection = peer.connect(callId);
    setConn(dataConnection) //Connいる?

    dataConnection.on('data', data => {
      console.log(data);
    });

  }

  /* 接続要求を受信時 */
  peer.on('connection', receiveDataConnection => {
    console.log('peer.on conection')
    const dataConnection = receiveDataConnection;
    /* 初期接続時 */
    console.log("setConn");
    setConn(dataConnection);

    /* メッセージ受信 */
    // setConn(dataConnection);
    dataConnection.on('data', data => {
      console.log(data);
    });
  })

  /* メッセージを送信時 */
  const send = () => {
    console.log('send conn=', conn);
    conn.send(message);
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

export default VideoCall