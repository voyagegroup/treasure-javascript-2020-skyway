import React, { useState, useEffect } from 'react';
import './App.css';
import Peer, { MediaConnection } from 'skyway-js';
import VideoStream from './components/VideoStream';

const connectMyStream = async (setMyStream: any) => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    setMyStream(myStream);
}

const setStreamListener = (mediaConnection: MediaConnection, setStream: any) => {
  mediaConnection.on('stream', stream => {
    setStream(stream);
  })
}

const makeCall = (peer: Peer, theirId: string, myStream: MediaStream, setTheirStream: any) => {
  const mediaConnection = peer.call(theirId, myStream);
  setStreamListener(mediaConnection, setTheirStream);
}

function App() {
  const SKYWAY_API_KEY = '9e30e124-19b5-462f-9315-0c8e4ebe5f96';

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [theirStream, setTheirStream] = useState<MediaStream | null>(null);

  const [peer] = useState(new Peer({key: SKYWAY_API_KEY}));

  const [myId, setMyId] = useState('');
  const [theirId, setTheirId] = useState('');

  useEffect(() => {
    if (!myStream) {
      connectMyStream(setMyStream);
    } else {
      peer.on('open', () => {
        setMyId(peer.id);
      })
    
      peer.on('call', mediaConnection => {
        mediaConnection.answer(myStream);
        setStreamListener(mediaConnection, setTheirStream);
      });
    }
  }, [peer, myStream]);

  return (
    <div className="App">
      <VideoStream
        srcObject={myStream}
        width="400px"
        autoPlay
        playsInline
        muted
      />
      <VideoStream
        srcObject={theirStream}
        width="400px"
        autoPlay
        playsInline
      />
      <p>My ID: {myId}</p>
      <input type="text" onChange={(e) => setTheirId(e.target.value)}></input>
      <button
        onClick={() => makeCall(peer, theirId, myStream!, setTheirStream)}
      >
        Call
      </button>
    </div>
  );
}

export default App;
