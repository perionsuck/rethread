// src/components/Avatar.js
import React from 'react';

const COLORS = ["#8B6F47", "#6B8E5A", "#C4956A", "#7B9E87", "#A67C5B", "#5C7A6B"];

export default function Avatar({ username, avatar, size = 40 }) {
  const idx = username ? username.charCodeAt(0) % COLORS.length : 0;

  if (avatar) {
    return (
      <img src={avatar} alt={username} style={{
        width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0
      }} />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: COLORS[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: "var(--font-display)", fontSize: size * 0.4,
      fontWeight: 700, flexShrink: 0
    }}>
      {username ? username[0].toUpperCase() : '?'}
    </div>
  );
}
