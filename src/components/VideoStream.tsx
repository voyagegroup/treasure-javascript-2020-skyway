import React, {VideoHTMLAttributes, useEffect, useRef} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface Props extends VideoHTMLAttributes<HTMLVideoElement> {
  primary?: boolean
  srcObject: MediaStream | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: ({primary} : {primary: boolean}) => ({
      margin: theme.spacing(1),
      borderRadius: '10px',
      backgroundColor: 'black',
      position: 'fixed',
      left: 0,
      top: 0,
      width: primary ? 'calc(100% - 25ch - 100px)' : '20%',
      zIndex: primary ? 10 : 11,
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