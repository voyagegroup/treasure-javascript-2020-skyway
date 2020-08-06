import React, { useState, useRef, useEffect } from "react";
import Peer, { MediaConnection } from "skyway-js";

const peer = new Peer({
  key: "1212399c-448f-4135-89d3-76deff99795a",
  debug: 3,
});

export const Video: React.FCX = ({ className }) => {
  const [peerId, setPeerId] = useState("");
  const [callId, setCallId] = useState("");
  const localVideo: any = useRef();
  const remoteVideo: any = useRef();

  useEffect(() => {
    peer.once("open", (id) => setPeerId(id));
  }, []);

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((localStream) => {
    localVideo.current.srcObject = localStream;
  });

  const connectHandler = () => {
    const mediaConnection = peer.call(callId, localVideo.current.video);
    mediaConnection.on("stream", async (stream: MediaStream) => {
      remoteVideo.current.srcObject = stream;
      await remoteVideo.current.play().catch(console.error);
    });
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCallId(e.currentTarget.value);
  };

  peer.on("call", (mediaConnection: MediaConnection) => {
    mediaConnection.answer(localVideo.current.srcObject);
    mediaConnection.on("stream", async (stream: MediaStream) => {
      remoteVideo.current.srcObject = stream;
    });
  });

  return (
    <section>
      <div>{peerId}</div>
      <input value={callId} onChange={handleChange}></input>
      <button onClick={connectHandler}>発信</button>
      <video width="400px" autoPlay muted={true} ref={localVideo}></video>
      <video width="400px" autoPlay muted={true} ref={remoteVideo}></video>
    </section>
  );
};
