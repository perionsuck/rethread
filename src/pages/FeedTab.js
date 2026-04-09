import React, { useState } from 'react';
import PostCard from '../components/PostCard';

export default function FeedTab({ posts, onUpvote, onViewProfile }) {
  const [sortBy, setSortBy] = useState('hot');

  const sorted = [...posts].sort((a, b) => {
    if (sortBy === 'hot') return b.upvotes - a.upvotes;
    return 0; // 'new' keeps original order
  });

  return (
    <div>
      {/* Sort buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {[['hot', 'Hot'], ['new', 'New'], ['top', 'Top']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              border: sortBy === key ? 'none' : '1.5px solid var(--color-border)',
              background: sortBy === key ? '#8B6F47' : '#6B8E5A',
              color: sortBy === key ? '#ffffff' : '#ffffff',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {sorted.map((post) => (
        <PostCard key={post.id} post={post} onUpvote={onUpvote} onViewProfile={onViewProfile} />
      ))}
    </div>
  );
}
