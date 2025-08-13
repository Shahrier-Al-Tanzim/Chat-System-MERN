import React from 'react';
// Update this import to match the actual export from '../types'
// For example, if the type is exported as default or under a different name, adjust accordingly
// If ChatMessage is the default export from '../types', use:
import type {ChatMessage} from '../types';

// Or, if it is exported under a different name, use the correct name:
// import type { CorrectTypeName } from '../types';

interface Props {
  messages: ChatMessage[];
  meId?: string;
}

const MessageList: React.FC<Props> = ({ messages, meId }) => {
  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {messages.map((m, i) => {
        const mine = m.sender.id === meId;
        return (
          <div
            key={i}
            style={{
              alignSelf: mine ? 'flex-end' : 'flex-start',
              background: mine ? '#e6f4ff' : '#f5f5f5',
              borderRadius: 12,
              padding: '8px 12px',
              maxWidth: '70%',
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>{m.sender.username}</div>
            <div>{m.content}</div>
            <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
