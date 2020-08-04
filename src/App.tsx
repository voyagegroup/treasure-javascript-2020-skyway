import React, { useState, useEffect } from 'react';
import './App.css';
import Peer, { MediaConnection } from 'skyway-js';
import VideoStream from './components/VideoStream';

const setMediaStreamListener = (mediaConnection: MediaConnection, setStream: any) => {
  mediaConnection.on('stream', stream => {
    setStream(stream);
  })
}

const connectMyMediaStream = async (setMyStream: any) => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    setMyStream(myStream);
}

const connectTheirMediaStream = (peer: Peer, theirId: string, myStream: MediaStream, setTheirStream: any) => {
  const mediaConnection = peer.call(theirId, myStream);
  setMediaStreamListener(mediaConnection, setTheirStream);
}

function App() {
  const SKYWAY_API_KEY = '9e30e124-19b5-462f-9315-0c8e4ebe5f96';

  const [myMediaStream, setMyMediaStream] = useState<MediaStream | null>(null);
  const [theirMediaStream, setTheirMediaStream] = useState<MediaStream | null>(null);

  const [peer] = useState(new Peer({key: SKYWAY_API_KEY}));

  const [myId, setMyId] = useState('');
  const [theirId, setTheirId] = useState('');

  useEffect(() => {
    if (!myMediaStream) {
      connectMyMediaStream(setMyMediaStream);
    } else {
      peer.on('open', () => {
        setMyId(peer.id);
      })
    
      peer.on('call', mediaConnection => {
        mediaConnection.answer(myMediaStream);
        setMediaStreamListener(mediaConnection, setTheirMediaStream);
      });
    }
  }, [peer, myMediaStream]);

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
      />
      <p>My ID: {myId}</p>
      <input type="text" onChange={(e) => setTheirId(e.target.value)}></input>
      <button
        onClick={() => connectTheirMediaStream(peer, theirId, myMediaStream!, setTheirMediaStream)}
      >
        Call
      </button>
    </div>
  );
}

export default App;
