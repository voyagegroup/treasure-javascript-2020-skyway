import React, {VideoHTMLAttributes, useEffect, useRef} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface Props extends VideoHTMLAttributes<HTMLVideoElement> {
  primary?: boolean
  srcObject: MediaStream | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: ({primary} : {primary: boolean}) => ({
      position: primary ? 'relative' : 'absolute',
      zIndex: primary ? 10 : 11,
      width: primary ? '100%' : '20%',
      maxHeight: primary ? '90vh' : undefined,
      left: 0,
      top: 0,
      borderRadius: '10px',
      backgroundColor: 'black',
    }),
  }),
);

function VideoStream({primary = false, srcObject, ...props}: Props) {
  const refVideo = useRef<HTMLVideoElement>(null);
  const classes = useStyles({primary});

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
  }, [srcObject]);

  return (
    <video
      ref={refVideo}
      className={classes.root}
      {...props}
    ></video>
  )
}

export default VideoStream;