import React, { useState } from 'react';
import PostCard from '../components/PostCard';
import { Calendar, FileText } from 'lucide-react';

export default function CompetitionsTab({ competitions, posts, users, onViewProfile }) {
  const [selectedComp, setSelectedComp] = useState(null);

  // View a single competition's entries
  if (selectedComp) {
    const compPosts = posts.filter((p) => p.competitionId === selectedComp.id);
    return (
      <div style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
        <button
          onClick={() => setSelectedComp(null)}
          style={{ background: 'none', border: 'none', fontSize: 14, color: 'var(--color-text-brown)', fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}
        >
          ← Back to competitions
        </button>

        {/* Competition detail card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(107,142,90,0.1), rgba(196,149,106,0.1))', borderRadius: 18, padding: 24, marginBottom: 20, border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{selectedComp.theme.split(' ')[0]}</span>
            <span style={{ fontSize: 12, background: selectedComp.status === 'active' ? 'var(--color-green)' : 'var(--color-text-muted)', color: '#6B8E5A', padding: '4px 12px', borderRadius: 20, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              {selectedComp.status === 'active' ? 'ACTIVE' : 'ENDED'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-dark)', margin: '0 0 6px' }}>{selectedComp.title}</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-mid)', lineHeight: 1.5, margin: '0 0 12px' }}>{selectedComp.description}</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text-brown)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {selectedComp.status === 'active' ? `Deadline: ${selectedComp.deadline}` : 'Competition ended'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={13} /> {selectedComp.entries} entries</span>
          </div>
        </div>

        {/* Competition entries */}
        {compPosts.length > 0 ? (
          compPosts.map((post) => (
            <PostCard key={post.id} post={post} users={users} onUpvote={() => {}} onViewProfile={onViewProfile} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            <p>No entries yet. Be the first!</p>
          </div>
        )}
      </div>
    );
  }

  // Competition list view
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-dark)', margin: '0 0 16px' }}>Competitions</h2>
      {competitions.map((comp, i) => (
        <div
          key={comp.id}
          onClick={() => setSelectedComp(comp)}
          style={{
            background: '#fff', border: '1px solid var(--color-border)', borderRadius: 16,
            padding: 20, marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            animation: `fadeSlideUp 0.4s ease-out ${i * 0.08}s both`,
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,142,90,0.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{comp.theme.split(' ')[0]}</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-text-dark)', margin: 0 }}>{comp.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-brown)', margin: '2px 0 0' }}>
                  {comp.entries} entries • {comp.status === 'active' ? `ends ${comp.deadline}` : 'Ended'}
                </p>
              </div>
            </div>
            <span style={{ fontSize: 12, background: comp.status === 'active' ? 'rgba(107,142,90,0.12)' : 'rgba(168,151,128,0.15)', color: comp.status === 'active' ? 'var(--color-green)' : 'var(--color-text-brown)', padding: '4px 12px', borderRadius: 20, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              {comp.status === 'active' ? 'Enter →' : 'View'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
