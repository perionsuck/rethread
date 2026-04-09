import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) return setError('Please fill in all fields');
    if (!isLogin && !username) return setError('Username is required');
    if (!email.includes('@')) return setError('Invalid email');
    if (password.length < 6) return setError('Password must be 6+ characters');

    login({
      id: 'u_me',
      username: username || email.split('@')[0],
      displayName: username || email.split('@')[0],
      email,
      bio: 'New to ReThread! ♻️',
      karma: 0,
      rankedPoints: 0,
      posts: 0,
      joined: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(165deg, #F5EFE6 0%, #E8DFD0 40%, #D4C5A9 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(107,142,90,0.12)', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(196,149,106,0.15)', filter: 'blur(50px)' }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B6F47' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div style={{
        width: 380, padding: 40, background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)', borderRadius: 24,
        boxShadow: '0 20px 60px rgba(139,111,71,0.15)',
        position: 'relative', zIndex: 1, animation: 'fadeSlideUp 0.6s ease-out',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>♻️</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#3D2E1F', margin: 0, letterSpacing: -1 }}>
            ReThread
          </h1>
          <p style={{ color: '#8B6F47', fontSize: 14, marginTop: 4 }}>Sustainable Fashion Community</p>
        </div>

        <div style={{ display: 'flex', background: '#F5EFE6', borderRadius: 12, padding: 3, marginBottom: 24 }}>
          {['Login', 'Sign Up'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setIsLogin(i === 0); setError(''); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
                background: (i === 0 ? isLogin : !isLogin) ? '#fff' : 'transparent',
                color: (i === 0 ? isLogin : !isLogin) ? '#3D2E1F' : '#8B6F47',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: (i === 0 ? isLogin : !isLogin) ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {!isLogin && (
          <input
            value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E8DFD0', borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 12, background: '#FDFBF7', outline: 'none', boxSizing: 'border-box' }}
          />
        )}
        <input
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" type="email"
          style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E8DFD0', borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 12, background: '#FDFBF7', outline: 'none', boxSizing: 'border-box' }}
        />
        <input
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" type="password"
          style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E8DFD0', borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 16, background: '#FDFBF7', outline: 'none', boxSizing: 'border-box' }}
        />

        {error && (
          <p style={{ color: '#C4956A', fontSize: 13, margin: '0 0 12px', textAlign: 'center' }}>{error}</p>
        )}

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '14px 0', background: 'linear-gradient(135deg, #6B8E5A, #7B9E87)',
          color: '#fff', border: 'none', borderRadius: 12, fontSize: 15,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(107,142,90,0.3)'
        }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#A89780', marginTop: 20 }}>
          {isLogin ? 'Demo: enter any email & password' : 'Join the upcycling revolution'}
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
