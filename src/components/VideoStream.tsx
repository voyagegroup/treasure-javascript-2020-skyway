import React, {VideoHTMLAttributes, useEffect, useRef} from 'react';

interface Props extends VideoHTMLAttributes<HTMLVideoElement> {
  srcObject: MediaStream | null
}

function VideoStream({srcObject, ...props}: Props) {
  const refVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject]);

  return (
    <div>
      <video
        ref={refVideo}
        {...props}
      ></video>
    </div>
  )
}

export default VideoStream;