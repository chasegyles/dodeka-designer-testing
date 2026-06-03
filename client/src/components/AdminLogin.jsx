import React, { useState } from 'react';
import { Card, Button, Icon, ErrorBanner } from './ui.jsx';
import { api, setAdminPassword } from '../api.js';

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e?.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      setAdminPassword(password);
      await api.login(password);
      onSuccess();
    } catch (e) {
      setAdminPassword('');
      setError(e.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg)',
    }}>
      <div style={{ maxWidth: 380, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, margin: '0 auto 14px',
            background: 'var(--text)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <Icon.Sparkles size={22} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Dodo Testing Admin</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Enter your admin password to continue.</p>
        </div>

        <Card padding="24px">
          <form onSubmit={submit}>
            <ErrorBanner message={error} onDismiss={() => setError('')} />
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
              Admin password
            </label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setVisible(v => !v)}
                style={{
                  position: 'absolute', right: 8, top: '50%',
                  transform: 'translateY(-50%)',
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-3)', borderRadius: 'var(--radius-sm)',
                }}>
                {visible ? <Icon.EyeOff size={15} /> : <Icon.Eye size={15} />}
              </button>
            </div>
            <Button type="submit" fullWidth disabled={!password || loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
