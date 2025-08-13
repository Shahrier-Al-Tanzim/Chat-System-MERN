import React, { useState } from 'react';

interface Props {
  onJoinPrivate: (otherUserId: string) => void;
}

const UserPicker: React.FC<Props> = ({ onJoinPrivate }) => {
  const [target, setTarget] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = target.trim();
        if (!t) return;
        onJoinPrivate(t);
      }}
      style={{ display: 'flex', gap: 8, padding: 12, borderBottom: '1px solid #eee' }}
    >
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter other user's ID for DM"
        style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
      />
      <button style={{ padding: '10px 16px', borderRadius: 8 }}>Join DM</button>
    </form>
  );
};

export default UserPicker;
