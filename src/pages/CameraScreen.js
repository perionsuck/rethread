// src/pages/CameraScreen.js
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createXai } from '@ai-sdk/xai';
import { generateText, generateImage } from 'ai';

const xai = createXai({ apiKey: process.env.REACT_APP_XAI_API_KEY });
const XAI_BASE = 'https://api.x.ai/v1';

export default function CameraScreen({ onBack, onPost }) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState('capture');
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postProcess, setPostProcess] = useState('');
  const [error, setError] = useState('');
  const [afterImage, setAfterImage] = useState(null);
  const fileInputRef = useRef(null);
  const afterFileInputRef = useRef(null);


  const ANALYSIS_PROMPT = `Analyse this garment in detail and suggest exactly 3 creative upcycle ideas.

Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation — just the raw JSON array.

Each object must have these exact keys:
- "title": string (short name for the idea)
- "icon": string (a single relevant emoji)
- "description": string (1-2 sentence overview)
- "imagePrompt": string (a vivid image generation prompt to visualise the finished upcycled item, e.g. "a stylish tote bag made from repurposed blue denim jeans, flat lay on a white surface, natural lighting, fashion photography")
- "steps": array of strings (4-6 clear step-by-step instructions)
- "materials": array of strings (3-5 required materials)`;

  // Step 1: Analyse the uploaded garment photo using Grok vision
  const analyseWithGrok = async (imageDataUrl) => {
    const apiKey = process.env.REACT_APP_XAI_API_KEY;
    if (!apiKey) throw new Error('Missing xAI API key. Set REACT_APP_XAI_API_KEY in your .env file.');

    const base64Image = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(';')[0].split(':')[1] || 'image/jpeg';

    // Vision call — uses /v1/responses with grok-4.20-reasoning (current model per docs)
    const visionRes = await fetch(`${XAI_BASE}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-4.20-reasoning',
        input: [{
          role: 'user',
          content: [
            {
              type: 'input_image',
              image_url: `data:${mimeType};base64,${base64Image}`,
              detail: 'high',
            },
            {
              type: 'input_text',
              text: ANALYSIS_PROMPT,
            },
          ],
        }],
      }),
    });

    if (!visionRes.ok) {
      const err = await visionRes.text();
      throw new Error(`Grok vision error (${visionRes.status}): ${err}`);
    }

    const visionData = await visionRes.json();
    // Responses API returns output array, not choices
    const rawText = visionData.output
      ?.filter(b => b.type === 'message')
      .flatMap(b => b.content)
      .filter(c => c.type === 'output_text')
      .map(c => c.text)
      .join('') || '';

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsedIdeas = JSON.parse(cleaned);

    // Fire all 3 image generations in parallel
    const ideasWithImages = await Promise.all(
      parsedIdeas.map(async (idea) => {
        let imageUrl = null;
        try {
          imageUrl = await generateIdeaImage(idea.imagePrompt);
        } catch (imgErr) {
          console.warn(`Image gen failed for "${idea.title}":`, imgErr.message);
        }
        return { ...idea, imageUrl };
      })
    );

    return ideasWithImages;
  };

  // Step 2: Generate an image for each upcycle idea using Grok image generation
  const generateIdeaImage = async (prompt) => {
    const apiKey = process.env.REACT_APP_XAI_API_KEY;

    const response = await fetch(`${XAI_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-imagine-image', // correct per docs
        prompt,
        n: 1,
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Grok image gen error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.data?.[0]?.url || null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setCapturedImage(dataUrl);
      setIdeas([]);
      setError('');
      await handleAnalyze(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAfterFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAfterImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (imageDataUrl) => {
    const imageToAnalyze = imageDataUrl || capturedImage;
    if (!imageToAnalyze) return;
    setStep('analyzing');

    try {
      // 1. Get 3 upcycle ideas from Grok vision
      const parsedIdeas = await analyseWithGrok(imageToAnalyze);

      // 2. Generate an image for each idea in parallel
      const ideasWithImages = await Promise.all(
        parsedIdeas.map(async (idea) => {
          let imageUrl = null;
          try {
            imageUrl = await generateIdeaImage(idea.imagePrompt);
          } catch (imgErr) {
            console.warn(`Image gen failed for "${idea.title}":`, imgErr.message);
          }
          return { ...idea, imageUrl };
        })
      );

      setIdeas(ideasWithImages);
      setStep('recommendations');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis failed. Please try again.');
      setStep('capture');
    }
  };

  const handleSelectRec = (rec) => {
    setSelectedRec(rec);
    setStep('steps');
  };

  const handleFinishProject = () => {
    setStep('compose');
    setPostProcess(
      selectedRec
        ? `Used the "${selectedRec.title}" technique.\n\nMaterials: ${selectedRec.materials?.join(', ')}\n\n`
        : ''
    );
  };

  const handleSubmitPost = () => {
    if (!postTitle.trim()) return;
    onPost({
      id: 'p_new_' + Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      title: postTitle,
      beforeImg: capturedImage || '📸',
      afterImg: afterImage || '✨',
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
            {error && (
              <div style={{
                padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 12, marginBottom: 16, color: '#DC2626',
                fontFamily: 'var(--font-body)', fontSize: 13
              }}>
                ⚠️ {error}
              </div>
            )}
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
          <div style={{ textAlign: 'center', padding: '40px 20px' }} className="fade-in">
            {capturedImage && (
              <img src={capturedImage} alt="captured" style={{
                width: 200, height: 260, objectFit: 'cover', borderRadius: 16,
                marginBottom: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
              }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'var(--color-green)',
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
                }} />
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--color-text-primary)' }}>Analysing your garment...</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
              Generating upcycle ideas and preview images — this takes about 15–20 seconds
            </p>
          </div>
        )}

        {/* STEP: Recommendations */}
        {step === 'recommendations' && (
          <div className="fade-in">
            {capturedImage && (
              <img src={capturedImage} alt="captured" style={{
                width: '100%', height: 200, objectFit: 'cover', borderRadius: 16,
                marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }} />
            )}
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)', fontSize: 14, marginBottom: 16 }}>
              Here are 3 ways to upcycle this piece:
            </p>

            {ideas.map((idea, i) => (
              <div key={i} onClick={() => handleSelectRec(idea)} style={{
                background: '#fff', border: '1.5px solid var(--color-border)',
                borderRadius: 16, marginBottom: 14, cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                overflow: 'hidden'
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#6B8E5A'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {idea.imageUrl ? (
                  <img
                    src={idea.imageUrl}
                    alt={idea.title}
                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: 100, background: 'linear-gradient(135deg, #F0F7ED, #F7F5EF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36
                  }}>
                    {idea.icon}
                  </div>
                )}

                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 24 }}>{idea.icon}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--color-text-primary)', margin: 0 }}>
                      {idea.title}
                    </h3>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {idea.description}
                  </p>
                  {idea.materials && (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {idea.materials.map((m, j) => (
                        <span key={j} style={{
                          background: '#F0F7ED', color: '#4A7A35', borderRadius: 20,
                          padding: '3px 10px', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 10, color: 'var(--color-green)', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                    View steps →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP: Step-by-step instructions */}
        {step === 'steps' && selectedRec && (
          <div className="fade-in">
            {selectedRec.imageUrl && (
              <img
                src={selectedRec.imageUrl}
                alt={selectedRec.title}
                style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 16, marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            )}

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 48 }}>{selectedRec.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-text-primary)', margin: '8px 0 4px' }}>
                {selectedRec.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-accent)' }}>
                {selectedRec.description}
              </p>
            </div>

            {selectedRec.materials && (
              <div style={{ background: '#F7F5EF', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
                  🧵 Materials needed
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedRec.materials.map((m, j) => (
                    <span key={j} style={{
                      background: '#fff', border: '1px solid #D4C5A9', color: '#5C4A30',
                      borderRadius: 20, padding: '4px 12px', fontSize: 12, fontFamily: 'var(--font-body)'
                    }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedRec.steps?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B8E5A, #7B9E87)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)', flexShrink: 0
                }}>{i + 1}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4A3D2E', lineHeight: 1.6, margin: 0, paddingTop: 5 }}>
                  {s}
                </p>
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
                  ? <img src={capturedImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <><span style={{ fontSize: 28 }}>📸</span><span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>Before</span></>
                }
              </div>
              <div onClick={() => afterFileInputRef.current?.click()} style={{
                flex: 1, aspectRatio: '1', background: 'var(--color-bg-secondary)', borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '1.5px dashed #C4B5A0', cursor: 'pointer', overflow: 'hidden'
              }}>
                {afterImage
                  ? <img src={afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <><span style={{ fontSize: 28 }}>✨</span><span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>After (tap to add)</span></>
                }
              </div>
              <input ref={afterFileInputRef} type="file" accept="image/*" onChange={handleAfterFileSelect} style={{ display: 'none' }} />
            </div>

            <input value={postTitle} onChange={e => setPostTitle(e.target.value)}
              placeholder="Give your creation a title..."
              style={{
                width: '100%', padding: '14px 16px', border: '1.5px solid var(--color-border)',
                borderRadius: 12, fontSize: 15, fontFamily: 'var(--font-body)', marginBottom: 12,
                background: '#fff', outline: 'none', boxSizing: 'border-box', fontWeight: 500
              }} />
            <textarea value={postProcess} onChange={e => setPostProcess(e.target.value)}
              placeholder="Describe your upcycling process..."
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