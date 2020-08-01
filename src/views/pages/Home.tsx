import * as React from "react";
import { useUserMedia } from "../../hooks/useUserMedia";

export const Home: React.FC<{}> = () => {
  const videoEl = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    useUserMedia()
      .then((stream) => {
          
        const videoElm = videoEl.current!;
        videoElm.srcObject = stream;
        videoElm.play();
      })
      .catch((error) => {
        console.error("mediaDevice.getUserMedia() error:", error);
        return;
      });
  }, []);

  return (
    <div>
      Hello <video ref={videoEl} />
    </div>
  );
};
