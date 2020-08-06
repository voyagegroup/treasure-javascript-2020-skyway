import React, { useState, useRef, useEffect } from "react";
import Peer, { MediaConnection } from "skyway-js";

const peer = new Peer({
  key: "1212399c-448f-4135-89d3-76deff99795a",
  debug: 3,
});

export const Video: React.FCX = ({ className }) => {
  const [peerId, setPeerId] = useState("");
  const [callId, setCallId] = useState("");
  const [camera, setCamera] = useState(true);
  const localVideo: any = useRef();
  const remoteVideo: any = useRef();

  useEffect(() => {
    peer.once("open", (id) => setPeerId(id));
    (async () => {
      const localStream = await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .catch((err) => alert(err));
      localVideo.current.srcObject = localStream;
    })();
  }, []);

  const connectHandler = () => {
    const mediaConnection = peer.call(callId, localVideo.current.srcObject);
    setEventListener(mediaConnection);
  };

  // 相手からの発信
  peer.on("call", (call) => {
    // 相手に自分のメディアストリームを送りつける！
    call.answer(localVideo.current.srcObject);
    // 相手のメディアストリームを自分のremoteVideoに表示する
    call.on("stream", (stream) => {
      remoteVideo.current.srcObject = stream;
    });
  });

  const setEventListener = (mediaConnection: any) => {
    mediaConnection.on("stream", (stream: any) => {
      remoteVideo.current.srcObject = stream;
    });
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
    localVideo.current.srcObject.getVideoTracks()[0].enabled = !camera;
    setCamera(!camera);
  };

  return (
    <section>
      <div>{peerId}</div>
      <input value={callId} onChange={handleChange}></input>
      <button onClick={connectHandler}>発信</button>
      <button onClick={disconnectHandler}>切断</button>
      <video width="400px" autoPlay muted={true} ref={localVideo}></video>
      <button onClick={videoMuteHandler}>Camera {camera ? "ON" : "OFF"}</button>
      <button></button>
      <video width="400px" autoPlay muted={true} ref={remoteVideo}></video>
    </section>
  );
};
