import * as React from "react";
import { useUserMedia } from "../../hooks/useUserMedia";
import { usePeer } from "../../hooks/usePeer";
import { requestDispatch } from "../../modules/requestDispatch/requestDispath";

export const Home: React.FC<{}> = () => {
  const [peerId, setPeerId] = React.useState("");
  const [userPeerId, setUserPeerId] = React.useState("");
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const peer = usePeer();

  let localStream: MediaStream;

  const videoEl = React.useRef<HTMLVideoElement>(null);
  const peerVideoEl = React.useRef<HTMLVideoElement>(null);
  const canvasEl = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    peer.on("open", () => {
      setUserPeerId(peer.id);

      // TODO: あとでなんとかする, 汚い
      peer.on("call", (mediaConnection) => {
        mediaConnection.answer(localStream);
        mediaConnection.on("stream", (stream) => {
          const videoElm = peerVideoEl.current!;
          videoElm.srcObject = stream;
          videoElm.play();
        });
      });
    });

    useUserMedia().then((stream) => {
      const videoElm = videoEl.current!;
      videoElm.srcObject = stream;
      videoElm.play();
      localStream = stream;

      //@ts-ignore
      const faceDetector = new FaceDetector();
      // @ts-ignore
      const imageCapture = new window.ImageCapture(
        // @ts-ignore
        videoEl.current!.srcObject.getVideoTracks()[0]
      );
      try {
        console.log("asdf");
        imageCapture.grabFrame().then(async (img: any) => {
          console.log(8);
          const faces = await faceDetector.detect(img).catch(console.error);
          console.log(faces);
          drawImageToCanvas(img)
          drawFaceRectToCanvas(faces);
        });
      } catch {
        // Sometimes this throws with message `undefined`...
        return;
      }
    });
  }, []);

  function drawImageToCanvas(faces: any) {
    const canvas = canvasEl.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = faces.width;
    canvas.height = faces.height;
    ctx.drawImage(faces, 0, 0);
  }

  function drawFaceRectToCanvas(faces: any) {
    const canvas = canvasEl.current!;
    const ctx = canvas.getContext("2d")!;
    const lineWidth = canvas.height / 100;

    for (const face of faces) {
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = lineWidth;
      ctx.rect(
        face.boundingBox.x,
        face.boundingBox.y,
        face.boundingBox.width,
        face.boundingBox.height
      );
      ctx.closePath();
      ctx.stroke();

      setStyle({
          position: "absolute",
          top: face.boundingBox.x ,
          left: face.boundingBox.y,
      })
    }
  }

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
      <canvas ref={canvasEl} />
      <img style={style} src="https://pics.prcm.jp/d7589d315a878/68866943/png/68866943_220x221.png" />
    </div>
  );
};
