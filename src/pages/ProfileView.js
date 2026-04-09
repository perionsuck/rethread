// src/pages/ProfileView.js
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import { ArrowUp, Trophy, FileText } from 'lucide-react';

export default function ProfileView({ user, posts, isOwn, onBack }) {
  const { logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [displayName, setDisplayName] = useState(user.displayName);
  const avatarInputRef = useRef(null);

  const userPosts = posts.filter(p => p.userId === user.id);

  const handleSave = () => {
    updateProfile({ ...user, bio, displayName });
    setEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateProfile({ ...user, avatar: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fade-in">
      {onBack && (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 14, color: 'var(--color-accent)',
          fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 6
        }}>← Back</button>
      )}

      {/* Profile card */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(107,142,90,0.1), rgba(196,149,106,0.08))',
        borderRadius: 20, padding: 28, marginBottom: 20,
        border: '1px solid var(--color-border)', textAlign: 'center', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 120, borderRadius: '50%', background: 'rgba(107,142,90,0.06)', filter: 'blur(20px)'
        }} />

        {/* Avatar with upload */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar username={user.username} avatar={user.avatar} size={72} />
          {isOwn && (
            <>
              <div onClick={() => avatarInputRef.current?.click()} style={{
                position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
                borderRadius: '50%', background: 'var(--color-green)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, cursor: 'pointer', border: '2px solid #fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}>📷</div>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            </>
          )}
        </div>

        {editing ? (
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={{
            display: 'block', margin: '12px auto 0', padding: '8px 14px',
            border: '1.5px solid var(--color-border)', borderRadius: 10,
            fontSize: 18, fontFamily: 'var(--font-display)', textAlign: 'center',
            background: '#fff', outline: 'none', width: 200
          }} />
        ) : (
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-primary)', margin: '12px 0 2px' }}>{user.displayName}</h2>
        )}

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 8px' }}>@{user.username}</p>

        {editing ? (
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} style={{
            width: '100%', padding: '10px 14px', border: '1.5px solid var(--color-border)',
            borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)',
            background: '#fff', outline: 'none', resize: 'none', textAlign: 'center', boxSizing: 'border-box'
          }} />
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>{user.bio}</p>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
          {[[<ArrowUp size={16} />, user.karma, 'Karma'], [<Trophy size={16} />, user.rankedPoints, 'Ranked'], [<FileText size={16} />, user.posts || userPosts.length, 'Posts']].map(([icon, val, label], i) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)' }}>{icon} {val}</div>
              
            </div>
          ))}
        </div>

        {/* Edit / Logout buttons */}
        {isOwn && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {editing ? (
              <>
                <button onClick={handleSave} style={{ padding: '8px 20px', background: 'var(--color-green)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditing(false)} style={{ padding: '8px 20px', background: '#F5EFE6', color: '#8B6F47', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} style={{ padding: '8px 20px', background: '#F5EFE6', color: '#8B6F47', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Edit Profile</button>
                <button onClick={logout} style={{ padding: '8px 20px', background: 'rgba(196,100,80,0.1)', color: 'var(--color-danger)', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* User's posts */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-text-primary)', margin: '0 0 12px' }}>
        {isOwn ? 'Your' : `${user.displayName}'s`} Creations
      </h3>
      {userPosts.length > 0
        ? userPosts.map(post => <PostCard key={post.id} post={post} users={[user]} onUpvote={() => {}} />)
        : (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>🪡</p>
            <p>No creations yet</p>
          </div>
        )}
    </div>
  );
}
