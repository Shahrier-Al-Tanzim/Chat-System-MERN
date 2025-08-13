import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../auth/useAuth';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import RoomSwitcher from '../components/RoomSwitcher';
import UserPicker from '../components/UserPicker';
import type { ChatMessage } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

function privateRoom(a: string, b: string) {
  return [a, b].sort().join('_');
}

const Chat: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [room, setRoom] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const rooms = useMemo(() => ['general', 'random', 'tech'], []);
  const messageListContainerRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageListContainerRef.current) {
      messageListContainerRef.current.scrollTop = messageListContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // connect once
  useEffect(() => {
    if (!token) return;

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = s;

    s.on('connect', () => {
      // default join happens on server; but we also sync client-side room join
      s.emit('joinRoom', 'general');
    });

    s.on('history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    s.on('message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on('privateMessage', (msg: ChatMessage) => {
      // only show DM if we’re in that DM room
      if (msg.room === room) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    s.on('joined', (joinedRoom: string) => {
      if (joinedRoom === room) return;
      // no-op (server confirmation)
    });

    s.on('connect_error', (err) => {
      console.error('socket error', err.message);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [token, room]);

  // when room changes, ask server for history
  useEffect(() => {
    if (!socketRef.current) return;
    setMessages([]);
    if (room.includes('_')) {
      // dm room -> we already join via joinPrivate below
      socketRef.current.emit('joinRoom', room);
    } else {
      socketRef.current.emit('joinRoom', room);
    }
  }, [room]);

  const sendPublic = (text: string) => {
    socketRef.current?.emit('message', { room, content: text });
  };

  const joinPrivateWith = (otherUserId: string) => {
    if (!user) return;
    const dm = privateRoom(user.id, otherUserId);
    setRoom(dm);
    socketRef.current?.emit('joinPrivate', otherUserId); // server will join correct DM room and emit history
  };

  const sendPrivate = (text: string) => {
    // when in a dm room, figure out the other user id
    if (!user) return;
    const parts = room.split('_');
    const other = parts[0] === user.id ? parts[1] : parts[0];
    socketRef.current?.emit('privateMessage', { toUserId: other, content: text });
  };

  const onSend = (text: string) => {
    if (room.includes('_')) sendPrivate(text);
    else sendPublic(text);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', overflow: 'hidden' }}>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 0, boxShadow: 'none', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ padding: 28, borderBottom: '1px solid #e9ecef', display: 'flex', gap: 8, alignItems: 'center', background: '#f8f9fa' }}>
          <div style={{ fontWeight: 700, fontSize: 28, color: '#228B22', letterSpacing: 1 }}>Chat</div>
          <div style={{ marginLeft: 'auto' }}>
            {user ? (
              <span style={{ color: '#228B22', fontWeight: 500 }}>
                Signed in as <strong>{user.name}</strong>{' '}
                <button onClick={logout} style={{ marginLeft: 12, background: '#e9ecef', color: '#228B22', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,139,34,0.06)' }}>Logout</button>
              </span>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ width: '20%', minWidth: 180, maxWidth: 320, borderRight: '1px solid #e9ecef', background: '#f8f9fa', padding: 24, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
            <RoomSwitcher current={room} onChange={setRoom} rooms={rooms} />
            <UserPicker onJoinPrivate={joinPrivateWith} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff', overflow: 'hidden', minWidth: 0 }}>
            <div
              style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 0 0 0', display: 'flex', flexDirection: 'column' }}
              ref={messageListContainerRef}
            >
              <MessageList messages={messages} meId={user?.id} />
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e9ecef', background: '#f8f9fa', position: 'sticky', bottom: 0, zIndex: 2, minWidth: 0 }}>
              <MessageInput onSend={onSend} placeholder={room.includes('_') ? 'Send a private message…' : 'Send to room…'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
