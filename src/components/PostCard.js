import React, { useState } from 'react';
import Avatar from './Avatar';
import UpvoteButton from './UpvoteButton';
import { MessageCircle, Trophy} from 'lucide-react';

// Helper to find a user's avatar from the users list
function getUserAvatar(users, userId) {
  const user = users?.find(u => u.id === userId);
  return user?.avatar || null;
}

function PostCard({ post, users, onUpvote, onViewProfile }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(post.comments);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setLocalComments([
      ...localComments,
      { id: 'c_' + Date.now(), userId: 'u_me', username: 'you', text: newComment, time: 'now' },
    ]);
    setNewComment('');
  };

  return (
    <div style={{
      background: '#fff', borderRadius: 18, border: '1px solid #E8DFD0',
      marginBottom: 14, overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(139,111,71,0.06)',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={() => onViewProfile?.(post.userId)} style={{ cursor: 'pointer' }}>
          <Avatar username={post.username} avatar={getUserAvatar(users, post.userId)} size={34} />
        </div>
        <div style={{ flex: 1 }}>
          <span
            onClick={() => onViewProfile?.(post.userId)}
            style={{ fontWeight: 600, fontSize: 13, color: '#3D2E1F', cursor: 'pointer' }}
          >
            {post.displayName}
          </span>
          <span style={{ fontSize: 12, color: '#A89780', marginLeft: 8 }}>{post.timeAgo}</span>
          {post.competitionId && (
            <span style={{
              fontSize: 10, background: 'linear-gradient(135deg, #C4956A, #D4A574)',
              color: '#fff', padding: '2px 8px', borderRadius: 20, marginLeft: 8, fontWeight: 600,
            }}>
              Competition <Trophy size={7} />
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        padding: '10px 18px 0', fontFamily: "'DM Sans', sans-serif",
        fontSize: 17, color: '#3D2E1F', margin: 0, lineHeight: 1.3,
      }}>
        {post.title}
      </h3>

      {/* Before / After images */}
      <div style={{ display: 'flex', gap: 2, margin: '12px 18px 0', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          flex: 1, background: '#F5EFE6', aspectRatio: '1',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {post.beforeImg.startsWith('/') 
  ? <img src={post.beforeImg} alt="before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  : <span style={{ fontSize: 48 }}>{post.beforeImg}</span>
}
          <span style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(61,46,31,0.7)', color: '#fff', fontSize: 10,
            padding: '3px 8px', borderRadius: 6, fontWeight: 600,
          }}>
            BEFORE
          </span>
        </div>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, rgba(107,142,90,0.1), rgba(123,158,135,0.1))',
          aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {post.afterImg.startsWith('/') 
            ? <img src={post.afterImg} alt="after" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           : <span style={{ fontSize: 48 }}>{post.afterImg}</span>
}
          <span style={{
            position: 'absolute', bottom: 8, left: 8,
            background: 'rgba(107,142,90,0.85)', color: '#fff', fontSize: 10,
            padding: '3px 8px', borderRadius: 6, fontWeight: 600,
          }}>
            AFTER
          </span>
        </div>
      </div>

      {/* Process text */}
      <div style={{ padding: '12px 18px 0' }}>
        <p style={{ fontSize: 13, color: '#6B5D4F', lineHeight: 1.6, margin: 0 }}>
          {expanded ? post.process : post.process.slice(0, 120) + (post.process.length > 120 ? '...' : '')}
        </p>
        {post.process.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', color: '#8B6F47',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 0',
            }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ padding: '10px 18px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <UpvoteButton count={post.upvotes} voted={post._voted} onVote={() => onUpvote(post.id)} />
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(139,111,71,0.08)', border: 'none', borderRadius: 20,
            padding: '6px 14px', cursor: 'pointer', color: '#8B6F47',
            fontWeight: 600, fontSize: 13,
          }}
        >
          <MessageCircle size={14} /> {localComments.length}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={{ borderTop: '1px solid #F0E8DA', padding: '12px 18px 14px', background: '#FDFBF7' }}>
          {localComments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <Avatar username={c.username} avatar={getUserAvatar(users, c.userId)} size={26} />
              <div>
                <span style={{ fontWeight: 600, fontSize: 12, color: '#3D2E1F' }}>{c.username}</span>
                <span style={{ fontSize: 11, color: '#A89780', marginLeft: 6 }}>{c.time}</span>
                <p style={{ fontSize: 13, color: '#4A3D2E', margin: '2px 0 0', lineHeight: 1.4 }}>{c.text}</p>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              style={{
                flex: 1, padding: '10px 14px', border: '1.5px solid #E8DFD0',
                borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                background: '#fff', outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8B6F47')}
              onBlur={(e) => (e.target.style.borderColor = '#E8DFD0')}
            />
            <button
              onClick={handleAddComment}
              style={{
                background: '#6B8E5A', color: '#fff', border: 'none',
                borderRadius: 10, padding: '0 16px', cursor: 'pointer', fontSize: 14,
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
