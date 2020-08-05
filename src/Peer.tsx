import React, { useState, useRef } from "react";
import Peer from "skyway-js";

const peer = new Peer({
  key: "1212399c-448f-4135-89d3-76deff99795a",
  debug: 3,
});

export const Video: React.FCX = ({ className }) => {
  const localVideo: any = useRef();

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((localStream) => {
    localVideo.current.srcObject = localStream;
  });

  return (
    <div>
      <video autoPlay muted={true} ref={localVideo}></video>
    </div>
  );
};
