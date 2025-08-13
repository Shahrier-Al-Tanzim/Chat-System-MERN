import React, { useState } from 'react';
import { signup } from '../api/auth';
import { useAuth } from '../auth/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC<{ onAuthedRoute?: string }> = ({ onAuthedRoute = '/chat' }) => {
  const { setAuth } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 60% 40%, #b2f2bb 0%, #e6fcf5 100%)' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: 40, borderRadius: 20, background: 'linear-gradient(135deg, #38d9a9 0%, #228B22 100%)', boxShadow: '0 8px 32px rgba(34,139,34,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: 20, fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>Sign up</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            setLoading(true);
            try {
                const data = await signup(form.username, form.email, form.password);
                setAuth(data);
                nav(onAuthedRoute);
              } catch (e: unknown) {
                if (typeof e === 'object' && e !== null && 'response' in e) {
                  const errObj = e as { response?: { data?: { message?: string } } };
                  setErr(errObj.response?.data?.message ?? 'Signup failed');
                } else {
                  setErr('Signup failed');
                }
              } finally {
                setLoading(false);
              }
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 12, width: '100%', alignItems: 'center' }}
        >
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ padding: '12px 16px', borderRadius: 10, border: 'none', width: '100%', fontSize: 18, background: 'rgba(255,255,255,0.85)', marginBottom: 2, boxShadow: '0 2px 8px rgba(34,139,34,0.06)' }}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ padding: '12px 16px', borderRadius: 10, border: 'none', width: '100%', fontSize: 18, background: 'rgba(255,255,255,0.85)', marginBottom: 2, boxShadow: '0 2px 8px rgba(34,139,34,0.06)' }}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ padding: '12px 16px', borderRadius: 10, border: 'none', width: '100%', fontSize: 18, background: 'rgba(255,255,255,0.85)', marginBottom: 2, boxShadow: '0 2px 8px rgba(34,139,34,0.06)' }}
          />
          {err && <div style={{ color: '#d7263d', textAlign: 'center', fontWeight: 500 }}>{err}</div>}
          <button disabled={loading} style={{ background: '#fff', color: '#228B22', border: 'none', borderRadius: 10, padding: '12px 0', fontSize: 19, fontWeight: 700, width: '100%', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(34,139,34,0.10)', marginTop: 6, transition: 'background 0.2s' }}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 500 }}>Have an account?</span> <Link to="/login" style={{ color: '#b2f2bb', fontWeight: 700, textDecoration: 'underline' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
