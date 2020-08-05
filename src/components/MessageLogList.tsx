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
  }),
)

export interface Message {
    type: string
    data: string
    datetime: string
}

function MessageLog({type, data}: Message) {
  if (type === 'txt') {
    return (
      <div className="message-log">
        <p>{data}</p>
      </div>
    );
  } else if (type === 'img') {
    return (
      <div className="message-log">
        <img src={data} alt="img"></img>
      </div>
    );
  }

  return <div className="message-log">Invalid message</div>;
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