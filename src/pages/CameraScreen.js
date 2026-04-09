// src/pages/CameraScreen.js
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { AI_RECOMMENDATIONS } from '../data/mockData';

export default function CameraScreen({ onBack, onPost }) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState('capture');
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postProcess, setPostProcess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCapturedImage(ev.target.result);
        setStep('analyzing');
        // TODO: Replace with actual Gemini API call
        setTimeout(() => setStep('recommendations'), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectRec = (rec) => {
    setSelectedRec(rec);
    setStep('steps');
  };

  const handleFinishProject = () => {
    setStep('compose');
    setPostProcess(selectedRec ? `Used the "${selectedRec.title}" technique.\n\n` : '');
  };

  const handleSubmitPost = () => {
    if (!postTitle.trim()) return;
    onPost({
      id: 'p_new_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      title: postTitle,
      beforeImg: '📸',
      afterImg: '✨',
      process: postProcess,
      upvotes: 0,
      comments: [],
      timeAgo: 'just now',
      competitionId: null,
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--color-border)', background: 'rgba(253,251,247,0.95)',
        backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10
      }}>
        
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-text-primary)', margin: 0 }}>
          {step === 'capture' ? 'Snap Your Garment' :
           step === 'analyzing' ? 'Analyzing...' :
           step === 'recommendations' ? 'Upcycle Ideas' :
           step === 'steps' ? selectedRec?.title :
           'Share Your Creation'}
        </h2>
      </div>

      <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>

        {/* STEP: Capture */}
        {step === 'capture' && (
          <div className="fade-in">
            <div onClick={() => fileInputRef.current?.click()} style={{
              width: '100%', aspectRatio: '3/4', border: '2px dashed #C4B5A0', borderRadius: 20,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: 'linear-gradient(135deg, rgba(107,142,90,0.05), rgba(196,149,106,0.05))',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)', fontSize: 16, fontWeight: 500 }}>Tap to take a photo</p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', fontSize: 13, marginTop: 6 }}>or upload from gallery</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: 'none' }} />
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
              Take a photo of the clothing item you want to upcycle. Our AI will suggest creative ways to transform it!
            </p>
          </div>
        )}

        {/* STEP: Analyzing */}
        {step === 'analyzing' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }} className="fade-in">
            {capturedImage && <img src={capturedImage} alt="captured" style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 16, marginBottom: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-green)', animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-text-primary)' }}>Analyzing your garment...</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)' }}>Finding the best upcycle ideas</p>
          </div>
        )}

        {/* STEP: 3 Recommendations */}
        {step === 'recommendations' && (
          <div className="fade-in">
            {capturedImage && <img src={capturedImage} alt="captured" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 16, marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />}
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)', fontSize: 14, marginBottom: 16 }}>Here are 3 ways to upcycle this piece:</p>
            {AI_RECOMMENDATIONS.map((rec, i) => (
              <div key={i} onClick={() => handleSelectRec(rec)} style={{
                padding: 20, background: '#fff', border: '1.5px solid var(--color-border)',
                borderRadius: 16, marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }} onMouseOver={e => { e.currentTarget.style.borderColor = '#6B8E5A'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                 onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{rec.icon}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-text-primary)', margin: 0 }}>{rec.title}</h3>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>{rec.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--color-green)', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                  View steps →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP: Step-by-step instructions */}
        {step === 'steps' && selectedRec && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 48 }}>{selectedRec.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-primary)', margin: '8px 0 4px' }}>{selectedRec.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-accent)' }}>{selectedRec.description}</p>
            </div>
            {selectedRec.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B8E5A, #7B9E87)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)', flexShrink: 0
                }}>{i + 1}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4A3D2E', lineHeight: 1.6, margin: 0, paddingTop: 5 }}>{s}</p>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep('recommendations')} style={{
                flex: 1, padding: '14px 0', background: '#F5EFE6', color: '#8B6F47',
                border: 'none', borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-body)',
                fontWeight: 600, cursor: 'pointer'
              }}>← Back</button>
              <button onClick={handleFinishProject} style={{
                flex: 2, padding: '14px 0', background: 'linear-gradient(135deg, #6B8E5A, #7B9E87)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 14,
                fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(107,142,90,0.3)'
              }}>Done! Share my creation →</button>
            </div>
          </div>
        )}

        {/* STEP: Compose post */}
        {step === 'compose' && (
          <div className="fade-in">
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{
                flex: 1, aspectRatio: '1', background: 'var(--color-bg-secondary)', borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '1.5px dashed #C4B5A0', overflow: 'hidden'
              }}>
                {capturedImage
                  ? <img src={capturedImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <><span style={{ fontSize: 28 }}>📸</span><span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>Before</span></>
                }
              </div>
              <div onClick={() => fileInputRef.current?.click()} style={{
                flex: 1, aspectRatio: '1', background: 'var(--color-bg-secondary)', borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '1.5px dashed #C4B5A0', cursor: 'pointer'
              }}>
                <span style={{ fontSize: 28 }}>✨</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>After (tap to add)</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={() => {}} style={{ display: 'none' }} />
            </div>

            <input value={postTitle} onChange={e => setPostTitle(e.target.value)}
              placeholder="Give your creation a title..."
              style={{
                width: '100%', padding: '14px 16px', border: '1.5px solid var(--color-border)',
                borderRadius: 12, fontSize: 15, fontFamily: 'var(--font-body)', marginBottom: 12,
                background: '#fff', outline: 'none', boxSizing: 'border-box', fontWeight: 500
              }} />
            <textarea value={postProcess} onChange={e => setPostProcess(e.target.value)}
              placeholder="Describe your upcycling process... What did you do? What materials did you use? Any tips?"
              rows={6}
              style={{
                width: '100%', padding: '14px 16px', border: '1.5px solid var(--color-border)',
                borderRadius: 12, fontSize: 14, fontFamily: 'var(--font-body)', marginBottom: 16,
                background: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6
              }} />

            <button onClick={handleSubmitPost} disabled={!postTitle.trim()} style={{
              width: '100%', padding: '14px 0',
              background: postTitle.trim() ? 'linear-gradient(135deg, #6B8E5A, #7B9E87)' : '#D4C5A9',
              color: '#fff', border: 'none', borderRadius: 12, fontSize: 15,
              fontFamily: 'var(--font-body)', fontWeight: 600,
              cursor: postTitle.trim() ? 'pointer' : 'default',
              boxShadow: postTitle.trim() ? '0 4px 15px rgba(107,142,90,0.3)' : 'none',
              transition: 'all 0.2s'
            }}>
              Post to ReThread ♻️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
