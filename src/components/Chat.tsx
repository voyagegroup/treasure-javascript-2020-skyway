import React from 'react';
import MessageLogList, { Message } from './MessageLogList';
import { makeStyles, Theme, createStyles, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      right: 0,
      top: '200px',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);

interface Props {
  messages: Message[]
  onChangeMessage: (event: any) => void
  onClickSend: (event: any) => void
}

function Chat(props: Props) {
  const classes = useStyles()

  return (
    <div id='chat' className={classes.root}>
      <MessageLogList messageList={props.messages} />
      <TextField type="text" onChange={props.onChangeMessage}></TextField>
      <Button onClick={props.onClickSend}>SEND</Button>
    </div>
  );
}

export default Chat;