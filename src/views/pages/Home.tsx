import * as React from "react";
import { useUserMedia } from "../../hooks/useUserMedia";
import { usePeer } from "../../hooks/usePeer";
import { requestDispatch } from "../../modules/requestDispatch/requestDispath";

export const Home: React.FC<{}> = () => {
  const [peerId, setPeerId] = React.useState("");
  const [userPeerId, setUserPeerId] = React.useState("");
  const peer = usePeer();

  let localStream: MediaStream;

  const videoEl = React.useRef<HTMLVideoElement>(null);
  const peerVideoEl = React.useRef<HTMLVideoElement>(null);

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
      Hello {userPeerId}
      <div>
        <input
          type="text"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button
          onClick={() => {
            requestDis();
          }}>
          発信
        </button>
      </div>{" "}
      <video ref={videoEl} />
      <video ref={peerVideoEl} />
    </div>
  );
};
