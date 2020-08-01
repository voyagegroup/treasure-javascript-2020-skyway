import Peer from "skyway-js";

export const usePeer = () => {
  return new Peer({
    key: process.env.SKYWAY_API_KEY!,
    debug: 3,
  });
};
