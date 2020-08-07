import * as React from 'react';
import Peer from 'skyway-js';

const peer = new Peer({ key: process.env.SKYWAY_API_KEY! });

const App: React.FC = () => {
  const [myId, setMyId] = React.useState('');
  const [callId, setCallId] = React.useState('');
  const localVideo = React.useRef<HTMLVideoElement>(null);
  const remoteVideo = React.useRef<HTMLVideoElement>(null);

  peer.on('open', () => {
    setMyId(peer.id);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        if (localVideo.current !== null) {
          localVideo.current.srcObject = localStream;
        }
      });
  });

  peer.on('call', (mediaConnection) => {
    if (localVideo.current !== null) {
      mediaConnection.answer(
        localVideo.current.srcObject as MediaStream | undefined
      );
    }
    mediaConnection.on('stream', async (stream) => {
      if (remoteVideo.current !== null) {
        remoteVideo.current.srcObject = stream;
      }
    });
  });

  const makeCall = () => {
    if (localVideo.current !== null) {
      const mediaConnection = peer.call(
        callId,
        localVideo.current.srcObject as MediaStream | undefined
      );
      mediaConnection.on('stream', async (stream: MediaStream) => {
        if (remoteVideo.current !== null) {
          remoteVideo.current.srcObject = stream;
        }
        if (remoteVideo.current !== null) {
          await remoteVideo.current.play().catch(console.error);
        }
      });
    }
  };

  return (
    <div>
      <div>skyway test</div>
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
        <button onClick={makeCall}>発信</button>
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
  );
};

export default App;
