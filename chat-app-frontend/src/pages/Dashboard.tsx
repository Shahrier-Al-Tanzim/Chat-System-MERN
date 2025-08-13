import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '64px auto', padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Welcome! Go to the <Link to="/chat">Chat</Link> to start messaging.</p>
    </div>
  );
};

export default Dashboard;
