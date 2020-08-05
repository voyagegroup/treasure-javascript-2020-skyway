import React, { useEffect, useRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 'calc(100vh - 300px)',
      overflow: 'scroll',
      borderTop: 'solid 1px #aaa',
      marginTop: theme.spacing(1),
    },
    messageLog: {
      borderBottom: 'solid 1px #aaf',
      width: 'calc(25ch + 50px)',
    },
    messageLogTxt: {
      wordWrap: 'break-word',
    },
    messageLogImg: {
      width: '100%',
      borderRadius: '10px',
      marginBottom: theme.spacing(1),
    }
  }),
)

export interface Message {
    type: 'txt' | 'img'
    data: string
    datetime: string
}

function MessageLog({type, data, datetime}: Message) {
  const classes = useStyles();

  if (type === 'txt') {
    return (
      <div className={classes.messageLog}>
        <p>{datetime}</p>
        <p className={classes.messageLogTxt}>{data}</p>
      </div>
    );
  } else if (type === 'img') {
    return (
      <div className={classes.messageLog}>
        <p>{datetime}</p>
        <img src={data} alt="img" className={classes.messageLogImg}></img>
      </div>
    );
  }

  return (
    <div className={classes.messageLog}>
      <p>{datetime}</p>
      <p>Invalid message</p>
    </div>
  );
}

interface Props {
    messageList: Message[]
}

function MessageLogList({messageList}: Props) {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messageList])

  return (
    <div
      ref={ref}
      className={classes.root}
    >
      {messageList.map(({type, data, datetime}) => {
        return (
          <MessageLog key={datetime} type={type} data={data} datetime={datetime} />
        )
      })}
    </div>
  )
}

export default MessageLogList;