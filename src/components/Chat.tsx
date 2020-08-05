import React from 'react';
import MessageLogList, { Message } from './MessageLogList';

interface Props {
  messages: Message[]
  onChangeMessage: (event: any) => void
  onClickSend: (event: any) => void
}

function Chat(props: Props) {
    return (
      <div id='chat'>
        <MessageLogList messageList={props.messages} />
        <input type="text" onChange={props.onChangeMessage}></input>
        <button onClick={props.onClickSend}>SEND</button>
      </div>
    );
}

export default Chat;