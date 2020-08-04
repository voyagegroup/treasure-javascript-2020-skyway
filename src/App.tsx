import React, { useState, useEffect } from 'react';
import './App.css';
import Peer, { MediaConnection, DataConnection } from 'skyway-js';
import VideoStream from './components/VideoStream';
import MessageLogList, { Message } from './components/MessageLogList';

function App() {
  const SKYWAY_API_KEY = '9e30e124-19b5-462f-9315-0c8e4ebe5f96';

  const [myMediaStream, setMyMediaStream] = useState<MediaStream | null>(null);
  const [theirMediaStream, setTheirMediaStream] = useState<MediaStream | null>(null);

  const [theirDataStream, setTheirDataStream] = useState<DataConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  const [peer] = useState(new Peer({key: SKYWAY_API_KEY}));

  const [myId, setMyId] = useState('');
  const [theirId, setTheirId] = useState('');

  useEffect(() => {
    if (!myMediaStream) {
      connectMyMediaStream();
    } else {
      peer.on('open', () => {
        setMyId(peer.id);
      })
    
      peer.on('call', mediaConnection => {
        mediaConnection.answer(myMediaStream);
        listenMediaStream(mediaConnection, setTheirMediaStream);
      });
    }
  }, [peer, myMediaStream]);

  useEffect(() => {
    peer.on('connection', dataConnection => {
      console.log("get connection")
      listenTheirDataStream(dataConnection);
    });
  }, [peer, messages])

  const listenMediaStream = (mediaConnection: MediaConnection, setStream: any) => {
    mediaConnection.on('stream', stream => {
      setStream(stream);
    })
  }
 
  const connectMyMediaStream = async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    setMyMediaStream(myStream);
  }

  const connectTheirMediaStream = () => {
    const mediaConnection = peer.call(theirId, myMediaStream!);
    listenMediaStream(mediaConnection, setTheirMediaStream);
  }

  const listenTheirDataStream = (dataConnection: DataConnection) => {
    setTheirDataStream(dataConnection);
    dataConnection.on('data', (data: Message) => {
      setMessages((messages: Message[]) => messages.concat(data))
    });
  }

  const connectTheirDataStream = (): DataConnection => {
    return peer.connect(theirId);
  }
  
  return (
    <div className="App">
      <VideoStream
        srcObject={myMediaStream}
        width="400px"
        autoPlay
        playsInline
        muted
      />
      <VideoStream
        srcObject={theirMediaStream}
        width="400px"
        autoPlay
        playsInline
        muted
      />
      <p>My ID: {myId}</p>
      <div>
        <input type="text" onChange={(e) => setTheirId(e.target.value)}></input>
        <button
          onClick={() => {
            connectTheirMediaStream();

            const dataConnection = connectTheirDataStream();
            listenTheirDataStream(dataConnection);
          }}
        >
          Call
        </button>
      </div>
      {theirDataStream !== null && (<div>
        <input type="text" onChange={(e) => setMessage(e.target.value)}></input>
        <button
          onClick={() => {
            const messageLog: Message = {
              type: 'txt',
              data: message,
              datetime: new Date().toISOString(),
            }
            theirDataStream.send(messageLog);
          }}
        >
          Send
        </button>
      </div>)}
      <MessageLogList messageList={messages} />
    </div>
  );
}

export default App;
