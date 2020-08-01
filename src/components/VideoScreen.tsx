import * as React from 'react'

import styled, { css } from 'styled-components'
import { VideoHeight, VideoWidth } from '../utils/sizes'

const Video = styled.video<{isPlaying: boolean}>`
  ${p => p.isPlaying
  ? css`
    height: ${VideoHeight}px;
    width: ${VideoWidth}px;
  `
  : css`display: none;`}
`

interface Props {
  video: React.MutableRefObject<HTMLVideoElement>;
  isPlaying: boolean;
}

const VideoScreen: React.FC<Props> = ({ video, isPlaying }) => {

  return (
    <Video
      ref={video}
        isPlaying={isPlaying}
        autoPlay
        muted
        playsInline />
  )
}

export default VideoScreen
