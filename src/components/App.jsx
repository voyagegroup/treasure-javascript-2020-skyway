import React from 'react'
import VideoCall from './VideoCall'
import TextCommunication from './TextCommunication'

const App = () => {
  console.log('start App')
  return (
    <div>
      <VideoCall />
      <TextCommunication />
    </div>
  )
}

export default App