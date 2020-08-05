import * as React from "react";
import { useUserMedia } from "../../hooks/useUserMedia";
import { getPeer } from "../../modules/getPeer/getPeer";
import { requestDispatch } from "../../modules/requestDispatch/requestDispath";
import { useSkyway } from "../../hooks/useSkyway/useSkyway";
import Peer from "skyway-js";

import {
  MaskStyle,
  drawFaceMask,
} from "../../modules/drawFaceMask/drawFaceMask";

import { FaceDetector } from "../../@types/FaceDetector";

export const Home: React.FC<{}> = () => {
  const [peerId, setPeerId] = React.useState("");
  const [userPeerId, setUserPeerId] = React.useState("");
  const [style, setStyle] = React.useState<MaskStyle>({
    display: "none",
  });

  let localStream: MediaStream;

  const videoEl = React.useRef<HTMLVideoElement>(null);
  const peerVideoEl = React.useRef<HTMLVideoElement>(null);

  let peer: Peer;

  React.useEffect(() => {
    peer = useSkyway({
      setUserPeerId: setPeerId,
      localStream: localStream,
      videoEl: videoEl.current!,
    });

    useUserMedia().then((stream) => {
      const videoElm = videoEl.current!;
      videoElm.srcObject = stream;
      videoElm.play();
      localStream = stream;

      // @ts-ignore
      const faceDetector = new FaceDetector() as FaceDetector;
      // @ts-ignore
      const imageCapture = new window.ImageCapture(
        // @ts-ignore
        videoEl.current!.srcObject.getVideoTracks()[0]
      );
      // @ts-ignore
      const imageCaptureOfPeer = new window.ImageCapture(
        // @ts-ignore
        videoEl.current!.srcObject.getVideoTracks()[0]
      );
      window.setInterval(() => {
        imageCapture.grabFrame().then(async (img: any) => {
          const faces = await faceDetector.detect(img).catch(console.error);
          if (faces) {
            drawFaceMask(faces, setStyle);
          }
        });
      }, 160);
    });
  }, []);

  // TODO: 関心の分離
  const requestDis = () => {
    const connection = peer.call(peerId, localStream);
    connection.on("stream", (stream) => {
      const videoElm = peerVideoEl.current!;
      videoElm.srcObject = stream;
      videoElm.play();
    });
  };

  return (
    <div>
      {/* Hello {userPeerId} */}
      <div>
        {/* <input
          type="text"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button
          onClick={() => {
            requestDis();
          }}>
          発信
        </button> */}
      </div>{" "}
      <video ref={videoEl} />
      <video ref={peerVideoEl} />
      <img
        style={style}
        src="https://pics.prcm.jp/d7589d315a878/68866943/png/68866943_220x221.png"
      />
    </div>
  );
};
