import React from 'react';

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
  return (
    <div>
      {messageList.map(({type, data, datetime}) => {
        return (
          <MessageLog key={datetime} type={type} data={data} datetime={datetime} />
          )
      })}
    </div>
  )
}

export default MessageLogList;