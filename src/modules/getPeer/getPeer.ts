import Peer from "skyway-js";

export const getPeer = () => {
  return new Peer({
    key: process.env.SKYWAY_API_KEY!,
    debug: 3,
  });
};
