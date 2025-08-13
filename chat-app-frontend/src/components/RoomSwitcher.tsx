import React from 'react';

interface Props {
  current: string;
  onChange: (room: string) => void;
  rooms: string[];
}

const RoomSwitcher: React.FC<Props> = ({ current, onChange, rooms }) => {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 12, borderBottom: '1px solid #eee' }}>
      {rooms.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: current === r ? '2px solid #1677ff' : '1px solid #ddd',
            background: current === r ? '#f0f6ff' : 'white',
          }}
        >
          #{r}
        </button>
      ))}
    </div>
  );
};

export default RoomSwitcher;
