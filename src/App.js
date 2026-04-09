import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MOCK_USERS, MOCK_POSTS, MOCK_COMPETITIONS } from './data/mockData';
import './styles/global.css';

import AuthScreen from './pages/AuthScreen';
import CameraScreen from './pages/CameraScreen';
import FeedTab from './pages/FeedTab';
import CompetitionsTab from './pages/CompetitionsTab';
import LeaderboardTab from './pages/LeaderboardTab';
import ProfileView from './pages/ProfileView';

import { Home, Camera, Trophy, BarChart3, User } from 'lucide-react';

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [users] = useState(MOCK_USERS);

  if (!currentUser) return <AuthScreen />;

  const handleUpvote = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, upvotes: p._voted ? p.upvotes - 1 : p.upvotes + 1, _voted: !p._voted }
        : p
    ));
  };

  const handleViewProfile = (userId) => {
    setViewingProfile(userId);
    setActiveTab('profile_view');
  };

  const viewUser = viewingProfile
    ? [...users, currentUser].find(u => u.id === viewingProfile)
    : null;

  const tabs = [
    { key: 'feed', label: 'Feed', icon: <Home size={20} /> },
    { key: 'compete', label: 'Compete', icon: <Trophy size={20} /> },
    { key: 'post', label: 'Post', icon: <Camera size={20} /> },
    { key: 'leaderboard', label: 'Ranks', icon: <BarChart3 size={20} /> },
    { key: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', maxWidth: 500, margin: '0 auto', position: 'relative' }}>
      {/* Top App Bar */}
      <div style={{
        padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--color-border)', background: 'rgba(253,251,247,0.95)',
        backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 20
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-primary)', margin: 0, letterSpacing: -0.5 }}>
          ♻️ ReThread
        </h1>
      </div>

      {/* Page Content */}
      <div style={{ padding: '16px 16px 90px', minHeight: 'calc(100vh - 130px)' }}>
        {activeTab === 'feed' && <FeedTab posts={posts} onUpvote={handleUpvote} onViewProfile={handleViewProfile} />}
        {activeTab === 'post' && (
          <CameraScreen
            onBack={() => setActiveTab('feed')}
            onPost={(post) => {
              setPosts(prev => [post, ...prev]);
              setActiveTab('feed');
            }}
          />
        )}
        {activeTab === 'compete' && <CompetitionsTab competitions={MOCK_COMPETITIONS} posts={posts} onViewProfile={handleViewProfile} />}
        {activeTab === 'leaderboard' && <LeaderboardTab users={users} onViewProfile={handleViewProfile} />}
        {activeTab === 'profile' && <ProfileView user={currentUser} posts={posts} isOwn={true} />}
        {activeTab === 'profile_view' && viewUser && (
          <ProfileView user={viewUser} posts={posts} isOwn={viewUser.id === currentUser.id}
            onBack={() => { setViewingProfile(null); setActiveTab('leaderboard'); }} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 500, background: 'rgba(253,251,247,0.95)',
        backdropFilter: 'blur(12px)', borderTop: '1px solid var(--color-border)',
        display: 'flex', padding: '8px 0 12px', zIndex: 20
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key || (activeTab === 'profile_view' && tab.key === 'leaderboard');
          return (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setViewingProfile(null); }} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', transition: 'all 0.2s',
              color: isActive ? 'var(--color-green)' : 'var(--color-text-muted)'
            }}>
              <span style={{ transition: 'transform 0.2s', transform: isActive ? 'scale(1.15)' : 'scale(1)' }}>{tab.icon}</span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-green)' : 'var(--color-text-muted)', transition: 'color 0.2s'
              }}>{tab.label}</span>
              {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-green)', marginTop: 1 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}