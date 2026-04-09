import React from 'react';

function UpvoteButton({ count, voted, onVote }) {
  return (
    <button
      onClick={onVote}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: voted ? 'rgba(107,142,90,0.15)' : 'rgba(139,111,71,0.08)',
        border: voted ? '1.5px solid #6B8E5A' : '1.5px solid transparent',
        borderRadius: 20, padding: '6px 14px', cursor: 'pointer',
        transition: 'all 0.2s', color: voted ? '#6B8E5A' : '#8B6F47',
        fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span style={{ fontSize: 16, transition: 'transform 0.2s', transform: voted ? 'scale(1.2)' : 'scale(1)' }}>▲</span>
      {count}
    </button>
  );
}

export default UpvoteButton;
