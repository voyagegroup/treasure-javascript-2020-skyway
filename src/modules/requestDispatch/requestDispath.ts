import Peer from "skyway-js";

export const requestDispatch: (peerId: string, peer: Peer, localStream?: MediaStream) => void = (peerId, peer, localStream) => {
    localStream ?? peer.call(peerId, localStream);
}