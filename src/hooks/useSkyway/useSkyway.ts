import { getPeer } from "../../modules/getPeer/getPeer";

interface Props {
  setUserPeerId: (peerId: string) => void;
  localStream: MediaStream;
  videoEl: HTMLMediaElement;
}

export const useSkyway = (props: Props) => {
  const peer = getPeer();

  peer.on("open", () => {
    props.setUserPeerId(peer.id);

    peer.on("call", (mediaConnection) => {
      mediaConnection.answer(props.localStream);
      mediaConnection.on("stream", (stream) => {
        props.videoEl.srcObject = stream;
        props.videoEl.play();
      });
    });
  });

  return peer;
};
