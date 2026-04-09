import React, { useState } from 'react';
import Avatar from '../components/Avatar';
import { Medal, Crown } from 'lucide-react';

export default function LeaderboardTab({ users, onViewProfile }) {
  const [sortBy, setSortBy] = useState('karma');

  const sorted = [...users].sort((a, b) =>
    sortBy === 'karma' ? b.karma - a.karma : b.rankedPoints - a.rankedPoints
  );

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-dark)', margin: '0 0 16px' }}>Leaderboard</h2>

      {/* Sort toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['karma', 'Post Karma'], ['ranked', 'Ranked Points']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              border: sortBy === key ? 'none' : '1.5px solid var(--color-border)',
              background: sortBy === key ? '#8B6F47' : '#6B8E5A',
              color: sortBy === key ? '#ffffff' : '#ffffff',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Rankings */}
      {sorted.map((user, i) => (
        <div
          key={user.id}
          onClick={() => onViewProfile(user.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 16,
            background: i < 3
              ? `linear-gradient(135deg, ${i === 0 ? 'rgba(212,165,116,0.12)' : i === 1 ? 'rgba(168,151,128,0.1)' : 'rgba(196,149,106,0.08)'}, transparent)`
              : '#fff',
            border: '1px solid var(--color-border)', borderRadius: 14,
            marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s',
            animation: `fadeSlideUp 0.4s ease-out ${i * 0.06}s both`,
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
        >
          {/* Rank */}
          <div style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: i < 3 ? 20 : 16, color: i === 0 ? 'var(--color-tan)' : 'var(--color-text-muted)' }}>
           {i === 0 ? <Crown size={20} color="#C4956A" /> : i === 1 ? <Medal size={20} color="#A89780" /> : i === 2 ? <Medal size={20} color="#B08D6A" /> : `${i + 1}`}
          </div>
          <Avatar username={user.username} avatar={user.avatar} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-dark)' }}>{user.displayName}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-muted)' }}>@{user.username}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--color-text-dark)' }}>
              {sortBy === 'karma' ? user.karma : user.rankedPoints}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-muted)' }}>
              {sortBy === 'karma' ? 'karma' : 'pts'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
