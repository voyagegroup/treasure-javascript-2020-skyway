import React, { useState, useEffect } from "react";
import Peer, { MediaConnection } from "skyway-js";

import { VideoStream } from "./components/Video";

const peer = new Peer({
  key: process.env.SKYWAY_API_KEY!,
});

export const Main: React.FCX = () => {
  const [peerId, setPeerId] = useState("");
  const [callId, setCallId] = useState("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [theirStream, setTheirStream] = useState<MediaStream | null>(null);
  const [isCamera, setIsCamera] = useState(true);

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

  // これは最初の1回だけで良い！レンダリングごとに毎回呼ばせない！
  const getMediaStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(localStream);
  };

  const setEventListener = (
    mediaConnection: MediaConnection,
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>
  ) => {
    mediaConnection.on("stream", (stream: MediaStream) => {
      setStream(stream);
    });
  };

  const connectHandler = () => {
    if (myStream != null) {
      const mediaConnection = peer.call(callId, myStream);
      setEventListener(mediaConnection, setTheirStream);
    }
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
    myStream!.getVideoTracks()[0].enabled = !isCamera;
    setIsCamera(!isCamera);
  };

  return (
    <section>
      <VideoStream width="400px" autoPlay muted srcObject={myStream}></VideoStream>
      <VideoStream width="400px" autoPlay muted srcObject={theirStream}></VideoStream>
      <div>{peerId}</div>
      <input value={callId} onChange={handleChange}></input>
      <button onClick={connectHandler}>発信</button>
      <button onClick={disconnectHandler}>切断</button>
      <button onClick={videoMuteHandler}>Camera {isCamera ? "ON" : "OFF"}</button>
    </section>
  );
};
