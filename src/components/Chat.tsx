import React from 'react';
import MessageLogList, { Message } from './MessageLogList';
import { makeStyles, Theme, createStyles, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      right: 0,
      top: '180px',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    fileUpload: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    fileInput: {
      display: 'none',
    }
  }),
);

interface Props {
  message: string
  messages: Message[]
  onChangeMessage: (event: any) => void
  onClickSend: (event: any) => void
  onFileChange: (event: any) => void
}

function Chat(props: Props) {
  const classes = useStyles()

  return (
    <div id='chat' className={classes.root}>
      <MessageLogList messageList={props.messages} />
      <TextField
        type="text"
        onChange={props.onChangeMessage}
        value={props.message}
      ></TextField>
      <Button color="primary" onClick={props.onClickSend}>SEND</Button>
      <div className={classes.fileUpload}>
        <input
          accept="image/*"
          className={classes.fileInput}
          id="contained-button-file"
          type="file"
          onChange={(e) => props.onFileChange(e)}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="outlined"
            color="primary"
            component="span"
            fullWidth
          >
            Upload image file
          </Button>
        </label>
      </div>
    </div>
  );
}

export default Chat;