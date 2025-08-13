import React, { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<Props> = ({ onSend, disabled, placeholder }) => {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        onSend(t);
        setText('');
      }}
      style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #eee' }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder ?? 'Type a message...'}
        style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <button disabled={disabled} style={{ padding: '10px 16px', borderRadius: 8 }}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
