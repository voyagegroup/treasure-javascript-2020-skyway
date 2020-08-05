import React, { useState, useEffect } from 'react';
import './App.css';
import Peer, { MediaConnection, DataConnection } from 'skyway-js';
import VideoStream from './components/VideoStream';
import { Message } from './components/MessageLogList';
import Chat from './components/Chat';
import ControlPanel from './components/ControlPanel';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoStreamContainer: {
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
    },
    videoStream: {
      margin: theme.spacing(1),
      position: 'relative',
      width: 'calc((100% - 25ch) - 100px)',
    },
  }),
);

function App() {
  const SKYWAY_API_KEY = '9e30e124-19b5-462f-9315-0c8e4ebe5f96';
  const classes = useStyles();

  const [myMediaStream, setMyMediaStream] = useState<MediaStream | null>(null);
  const [theirMediaStream, setTheirMediaStream] = useState<MediaStream | null>(null);

  const [theirDataStream, setTheirDataStream] = useState<DataConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  const [peer] = useState(new Peer({key: SKYWAY_API_KEY}));

  const [myId, setMyId] = useState('');
  const [theirId, setTheirId] = useState('');

  useEffect(() => {
    if (!myMediaStream) {
      connectMyMediaStream();
    } else {
      peer.on('open', () => {
        setMyId(peer.id);
      })

      peer.on('call', mediaConnection => {
        mediaConnection.answer(myMediaStream);
        listenMediaStream(mediaConnection, setTheirMediaStream);
      });
    }
  }, [peer, myMediaStream]);

  useEffect(() => {
    peer.on('connection', dataConnection => {
      console.log("get connection")
      listenTheirDataStream(dataConnection);
    });
  }, [peer, messages])

  useEffect(() => {
    if (!!peer.id) {
      setMyId(peer.id)
    }
  }, [peer.id])

  const listenMediaStream = (mediaConnection: MediaConnection, setStream: any) => {
    mediaConnection.on('stream', stream => {
      setStream(stream);
    })
  }
 
  const connectMyMediaStream = async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    setMyMediaStream(myStream);
  }

  const connectTheirMediaStream = () => {
    const mediaConnection = peer.call(theirId, myMediaStream!);
    listenMediaStream(mediaConnection, setTheirMediaStream);
  }

  const listenTheirDataStream = (dataConnection: DataConnection) => {
    setTheirDataStream(dataConnection);
    dataConnection.on('data', (data: Message) => {
      setMessages((messages: Message[]) => messages.concat(data))
    });
  }

  const connectTheirDataStream = (): DataConnection => {
    return peer.connect(theirId);
  }
  
  return (
    <div className="App">
      <div className={classes.videoStreamContainer}>
        <div className={classes.videoStream}>
          <VideoStream
            primary
            srcObject={theirMediaStream}
            autoPlay
            playsInline
            muted
          />
          <VideoStream
            srcObject={myMediaStream}
            autoPlay
            playsInline
            muted
          />
        </div>
      </div>
      <ControlPanel
        myPeerId={myId}
        onChangeTheirId={(e) => setTheirId(e.target.value)}
        onClickCall={() => {
          connectTheirMediaStream();

          const dataConnection = connectTheirDataStream();
          listenTheirDataStream(dataConnection);
        }}
      />
      {theirDataStream !== null && 
        <Chat
          message={message}
          messages={messages}
          onChangeMessage={(e) => setMessage(e.target.value)}
          onClickSend={() => {
            const msg: Message = {
              type: 'txt',
              data: message,
              datetime: new Date().toISOString(),
            }

            setMessage('')
            setMessages((messages: Message[]) => messages.concat(msg))
            theirDataStream.send(msg);
          }}
          onFileChange={(e) => {
            const imgFile = e.target.files[0];
            const fileReader = new FileReader();

            fileReader.onload = function() {
              const base64: any = this.result!;

              const msg: Message = {
                type: 'img',
                data: base64,
                datetime: new Date().toISOString(),
              }

              theirDataStream.send(msg);
              setMessages((messages: Message[]) => messages.concat(msg))
            }

            if (imgFile) {
              fileReader.readAsDataURL(imgFile);
            }
          }}
        />
      }
    </div>
  );
}

export default App;
