import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TopBar, Container, Card, Button, Badge, Icon,
  Spinner, ErrorBanner,
} from '../components/ui.jsx';
import { api } from '../api.js';

const DEFAULT_SOURCES = [
  'https://en.wikipedia.org/wiki/George_Washington',
  'https://en.wikipedia.org/wiki/Thomas_Jefferson',
  'https://en.wikipedia.org/wiki/Abraham_Lincoln',
];

const FOCUS_MAX = 2000;

export default function CreateVariant() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [newUrl, setNewUrl] = useState('');
  const [count, setCount] = useState(10);
  const [focusPrompt, setFocusPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');

  const addSource = () => {
    const u = newUrl.trim();
    if (!u) return;
    if (!/^https?:\/\//.test(u)) { setUrlError('URL must start with http:// or https://'); return; }
    if (sources.includes(u)) { setUrlError('Already added.'); return; }
    setSources([...sources, u]);
    setNewUrl('');
    setUrlError('');
  };
  const removeSource = (i) => setSources(sources.filter((_, idx) => idx !== i));

  const canSubmit = name.trim() && sources.length > 0 && count > 0 && !submitting;
  const focusLen = focusPrompt.length;
  const focusOver = focusLen > FOCUS_MAX;

  const submit = async () => {
    if (focusOver) {
      setError(`Focus prompt is too long (${focusLen}/${FOCUS_MAX} characters).`);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await api.createVariant({
        name: name.trim(),
        sourceUrls: sources,
        questionCount: count,
        focusPrompt: focusPrompt.trim(),
      });
      navigate(`/variant/${result.id}`);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Quizly" subtitle="Generating" right={<Badge variant="brand">Working</Badge>} />
        <Container narrow>
          <Card padding="48px" style={{ textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, margin: '0 auto 20px',
              background: 'var(--brand-soft)', borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--brand)', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: -3,
                border: '2px solid var(--brand)', borderRightColor: 'transparent',
                borderRadius: 18, animation: 'spin 1s linear infinite',
              }} />
              <Icon.Sparkles size={24} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8 }}>
              Building your quiz
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
              Reading {sources.length} source{sources.length !== 1 ? 's' : ''} and writing {count} questions.
              This usually takes 20–60 seconds.
            </p>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Quizly"
        subtitle="New quiz"
        right={
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" icon={Icon.ArrowLeft}>Dashboard</Button>
          </Link>
        }
      />

      <Container>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>
            Create a new quiz
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
            Give the quiz a name, add the source material, and choose how many questions to generate.
          </p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Name */}
        <Card style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
            Quiz name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Webflow Onboarding Q1 2026"
          />
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>
            Internal name for this quiz variant. Designers won't see it.
          </p>
        </Card>

        {/* Sources */}
        <Card padding="0" style={{ marginBottom: 20 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <Icon.FileText size={16} />
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>Sources</h2>
              <Badge>{sources.length}</Badge>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              URLs Quizly will read to generate questions
            </div>
          </div>

          {sources.length > 0 && (
            <div>
              {sources.map((url, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 24px',
                  borderBottom: i < sources.length - 1 ? '1px solid var(--border)' : 'none',
                  fontSize: 13,
                }}>
                  <div style={{
                    width: 28, height: 28,
                    background: 'var(--brand-soft)', color: 'var(--brand-text)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon.Link size={13} />
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, color: 'var(--text)', textDecoration: 'none', wordBreak: 'break-all', fontWeight: 500 }}>
                    {url}
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => removeSource(i)} icon={Icon.Trash}>Remove</Button>
                </div>
              ))}
            </div>
          )}

          <div style={{
            padding: '16px 24px',
            background: 'var(--surface-2)',
            borderTop: sources.length > 0 ? '1px solid var(--border)' : 'none',
            borderBottomLeftRadius: 'var(--radius-lg)',
            borderBottomRightRadius: 'var(--radius-lg)',
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="url"
                value={newUrl}
                onChange={e => { setNewUrl(e.target.value); setUrlError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSource(); } }}
                placeholder="https://example.com/article"
              />
              <Button onClick={addSource} icon={Icon.Plus} variant="secondary">Add</Button>
            </div>
            {urlError && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon.X size={14} /> {urlError}
              </div>
            )}
          </div>
        </Card>

        {/* Focus prompt */}
        <Card padding="0" style={{ marginBottom: 20 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <Icon.Sparkles size={16} />
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>Focus instructions</h2>
              <Badge>Optional</Badge>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Steer the question generation. Tell Claude what topics, angles, or skills to prioritize.
            </div>
          </div>
          <div style={{ padding: '16px 24px' }}>
            <textarea
              value={focusPrompt}
              onChange={e => setFocusPrompt(e.target.value)}
              placeholder={'e.g. "Focus on CSS Grid layout concepts and when to use Flexbox vs Grid. Avoid questions about exact spec history. Prioritize practical Webflow Designer scenarios over theory."'}
              rows={5}
              style={{
                resize: 'vertical',
                minHeight: 110,
                lineHeight: 1.55,
                fontSize: 14,
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              fontSize: 12,
              color: focusOver ? 'var(--danger-text)' : 'var(--text-3)',
            }}>
              <span>
                Questions still come from the sources above. This guidance shapes which facts get tested.
              </span>
              <span style={{ fontWeight: focusOver ? 600 : 400, whiteSpace: 'nowrap', marginLeft: 12 }}>
                {focusLen} / {FOCUS_MAX}
              </span>
            </div>
          </div>
        </Card>

        {/* Count */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Icon.Settings size={16} />
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Question count</h2>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
            How many multiple-choice questions to generate
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{
              minWidth: 88, textAlign: 'center',
              padding: '12px 16px',
              background: 'var(--brand-soft)',
              borderRadius: 'var(--radius)',
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--brand-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {count}
              </div>
              <div style={{ fontSize: 11, color: 'var(--brand-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4, fontWeight: 500 }}>
                Questions
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="range" min="3" max="25" value={count}
                onChange={e => setCount(parseInt(e.target.value, 10))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-4)', marginTop: 8, fontWeight: 500 }}>
                <span>3</span><span>10</span><span>17</span><span>25</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Ready to generate</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {sources.length} source{sources.length !== 1 ? 's' : ''} · {count} question{count !== 1 ? 's' : ''}
              {focusPrompt.trim() && ' · focus guidance set'}
            </div>
          </div>
          <Button onClick={submit} disabled={!canSubmit || focusOver} iconRight={Icon.ArrowRight} size="lg">
            Generate quiz
          </Button>
        </div>
      </Container>
    </div>
  );
}
