import { v4 as uuid } from 'uuid';

import ChatRecived from './elements/ChatRecived';
import ChatSent from './elements/ChatSent';

const ChatContent = ({ messages, uid }) => {
  
  return (
    <>
      {messages.map(message =>
        message.uid !== uid ? (
          <ChatRecived key={uuid()} text={message.text} />
        ) : (
          <ChatSent key={uuid()} text={message.text} />
        )
      )}
    </>
  );
};

export default ChatContent;
