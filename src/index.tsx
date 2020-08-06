import * as React from 'react'
import * as ReactDOM from 'react-dom'
import VideoScreen from './components/VideoScreen'
import IconButton from './components/Button'
import Field from './components/Field'
import Peer, { DataConnection, MediaConnection } from 'skyway-js'

const peer = new Peer({
  key: "17f87a7c-2f92-4747-b274-d65882a0ebdb",
  debug: 0
})

let mc: MediaConnection;
let dc: DataConnection;

interface State {
  values: {
    id: number;
    content: string;
  }[];
}

type Action = {
  type: 'add',
  id: number,
  value: string
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'add':
      return {
        values: [
          ...state.values,
          {
            id: action.id,
            content: `${action.value}\n`
          }
        ]
      }
    default:
      return state
  }
}

const App = () => {

  const [localID, setLocalID] = React.useState<string>('')
  const [remoteID, setRemoteID] = React.useState<string>('')
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState('')
  const [state, dispatch] = React.useReducer(reducer, { values: []})
  const localVideo = React.useRef<HTMLVideoElement>(null)
  const remoteVideo = React.useRef<HTMLVideoElement>(null)

  peer.on('open', () => {
    setLocalID(peer.id)
  })

  peer.on('call', async (mediaConnection: MediaConnection) => {
    if (!localVideo.current.srcObject) {
      await enableLocalVideo()
    }
    mediaConnection.answer(localVideo.current.srcObject as MediaStream)
    eventHandlerForMedia(mediaConnection)
  })

  peer.on('connection', (dataConnection: DataConnection) => {
    if (!dc) {
      eventHandlerForData(dataConnection)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRemoteID(e.target.value)
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value)
  }

  const handleCall = async () => {
    await enableLocalVideo()
    const mediaConnection = peer.call(remoteID, localVideo.current.srcObject as MediaStream)
    eventHandlerForMedia(mediaConnection)
  }

  const handleStop = () => {
    mc.close(true);
  }

  const handleLink = async () => {
    const dataConnection = peer.connect(remoteID)
    eventHandlerForData(dataConnection)
  }

  const handleSend = () => {
    dc.send(message)
    dispatch({type: 'add', id: 0, value: `${message}\n`})
  }

  const enableLocalVideo = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    localVideo.current.srcObject = localStream
    await localVideo.current.play()
  }

  const eventHandlerForMedia = (mediaConnection: MediaConnection) => {
    mc = mediaConnection;
    mediaConnection.on('stream', async (stream: MediaStream) => {
      remoteVideo.current.srcObject = stream;
      await remoteVideo.current.play();
      setIsPlaying(true);
    });
    mediaConnection.on('close', () => {
      setIsPlaying(false);
    })
  }

  const eventHandlerForData = (dataConnection: DataConnection) => {
    dc = dataConnection;
    dataConnection.on('data', data => {
      dispatch({type: 'add', id: 1, value: `${data}\n`})
    });
  }

  const dummy = [
    {
      id: 0,
      content: 'hello\nhello\nhello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 0,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 0,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 0,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello'
    },
    {
      id: 1,
      content: 'hello\nhello\nhello\nhello'
    }
  ]

  return (
    <div>
      <IconButton emoji={0x1f4de} handleClick={handleCall} />
      <IconButton emoji={0x1f6d1} handleClick={handleStop} />
      <IconButton emoji={0x1f517} handleClick={handleLink} />
      <div>
        local ID: {localID}
      </div>
      <div>
        Remote ID:
        <input type="text" value={remoteID} onChange={handleChange}></input>
      </div>
      <textarea onChange={handleInput} />
      <IconButton emoji={0x1f680} handleClick={handleSend} />
      <div>
        <VideoScreen video={localVideo} isPlaying={isPlaying}/>
      </div>
      <div>
        <VideoScreen video={remoteVideo} isPlaying={isPlaying}/>
      </div>
      <Field contents={state.values}/>
    </div>
  )
}

ReactDOM.render(
  <App/>, document.getElementById('app')
)
