import React, { useState } from 'react';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';

export default function ProfileView({ user, posts, isOwn, onBack, onLogout, onEditSave }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [displayName, setDisplayName] = useState(user.displayName);

  const userPosts = posts.filter((p) => p.userId === user.id);

  const handleSave = () => {
    onEditSave?.({ ...user, bio, displayName });
    setEditing(false);
  };

  return (
    <div style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 14, color: 'var(--color-text-brown)', fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}
        >
          ← Back
        </button>
      )}

      {/* Profile card */}
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(107,142,90,0.1), rgba(196,149,106,0.08))',
          borderRadius: 20, padding: 28, marginBottom: 20,
          border: '1px solid var(--color-border)', textAlign: 'center', position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 120, height: 120, borderRadius: '50%', background: 'rgba(107,142,90,0.06)', filter: 'blur(20px)' }} />
        <Avatar username={user.username} size={72} />

        {/* Name */}
        {editing ? (
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ display: 'block', margin: '12px auto 0', padding: '8px 14px', border: '1.5px solid var(--color-border)', borderRadius: 10, fontSize: 18, fontFamily: 'var(--font-display)', textAlign: 'center', background: '#fff', outline: 'none', width: 200 }}
          />
        ) : (
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-dark)', margin: '12px 0 2px' }}>{user.displayName}</h2>
        )}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 8px' }}>@{user.username}</p>

        {/* Bio */}
        {editing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--color-border)', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', resize: 'none', textAlign: 'center', boxSizing: 'border-box' }}
          />
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-mid)', margin: '0 0 16px', lineHeight: 1.5 }}>{user.bio}</p>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
          {[
            ['⬆️', user.karma, 'Karma'],
            ['🏆', user.rankedPoints, 'Ranked'],
            ['📝', user.posts || userPosts.length, 'Posts'],
          ].map(([icon, val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: 'var(--color-text-dark)' }}>{icon} {val}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Edit / Logout buttons */}
        {isOwn && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            {editing ? (
              <>
                <button onClick={handleSave} style={{ padding: '8px 20px', background: 'var(--color-green)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditing(false)} style={{ padding: '8px 20px', background: 'var(--color-bg-warm)', color: 'var(--color-text-brown)', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} style={{ padding: '8px 20px', background: 'var(--color-bg-warm)', color: 'var(--color-text-brown)', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Edit Profile</button>
                <button onClick={onLogout} style={{ padding: '8px 20px', background: 'rgba(196,100,80,0.1)', color: 'var(--color-red)', border: 'none', borderRadius: 10, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* User's posts */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-text-dark)', margin: '0 0 12px' }}>
        {isOwn ? 'Your' : `${user.displayName}'s`} Creations
      </h3>
      {userPosts.length > 0 ? (
        userPosts.map((post) => <PostCard key={post.id} post={post} onUpvote={() => {}} />)
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          <p style={{ fontSize: 40, marginBottom: 8 }}>🪡</p>
          <p>No creations yet</p>
        </div>
      )}
    </div>
  );
}
