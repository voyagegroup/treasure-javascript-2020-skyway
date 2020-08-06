import React, { useState, useRef, useEffect } from "react";
import Peer, { MediaConnection } from "skyway-js";

const peer = new Peer({
  key: "1212399c-448f-4135-89d3-76deff99795a",
});

export const Video: React.FCX = ({ className }) => {
  const [peerId, setPeerId] = useState("");
  const [callId, setCallId] = useState("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [theirStream, setTheirStream] = useState<MediaStream | null>(null);
  const [isCamera, setIsCamera] = useState(true);
  const localVideo: any = useRef<HTMLVideoElement>(null);
  const remoteVideo: any = useRef();

  useEffect(() => {
    if (!myStream) {
      getMediaStream();
    } else {
      peer.once("open", (id) => setPeerId(id));
      peer.on("call", (call) => {
        if (confirm("接続しますか?")) {
          call.answer(myStream);
          setEventListener(call, setTheirStream);
        }
      });
    }
  }, [myStream]);

  const getMediaStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = localStream;
    setMyStream(localStream);
  };

  const setEventListener = (mediaConnection: MediaConnection, setStream: any) => {
    mediaConnection.on("stream", (stream: MediaStream) => {
      remoteVideo.current.srcObject = stream;
      setStream(stream);
    });
  };

  const connectHandler = () => {
    const mediaConnection = peer.call(callId, localVideo.current.srcObject);
    setEventListener(mediaConnection, setTheirStream);
  };

  const disconnectHandler = () => {
    peer.destroy();
  };

  peer.on("close", () => {
    alert("接続が切れました");
  });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCallId(e.currentTarget.value);
  };

  const videoMuteHandler = () => {
    localVideo.current.srcObject.getVideoTracks()[0].enabled = !isCamera;
    setIsCamera(!isCamera);
  };

  return (
    <section>
      <div>{peerId}</div>
      <input value={callId} onChange={handleChange}></input>
      <button onClick={connectHandler}>発信</button>
      <button onClick={disconnectHandler}>切断</button>
      <video width="400px" autoPlay muted={true} ref={localVideo}></video>
      <button onClick={videoMuteHandler}>Camera {isCamera ? "ON" : "OFF"}</button>
      <video width="400px" autoPlay muted={true} ref={remoteVideo}></video>
    </section>
  );
};
