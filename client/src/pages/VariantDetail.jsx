import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  TopBar, Container, Card, Button, Badge, Icon,
  CenteredSpinner, EmptyState, ErrorBanner, CopyButton, formatDate, verdictFor,
} from '../components/ui.jsx';
import AdminLogin from '../components/AdminLogin.jsx';
import { api } from '../api.js';

export default function VariantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const load = async () => {
    setError('');
    try {
      const v = await api.getVariant(id);
      setData(v);
      setNeedsLogin(false);
    } catch (e) {
      if (e.code === 401) {
        setNeedsLogin(true);
      } else {
        setError(e.message);
      }
    }
  };

  useEffect(() => { load(); }, [id]);

  const remove = async () => {
    if (!confirm(`Delete "${data.name}" and all its attempts?`)) return;
    try {
      await api.deleteVariant(id);
      navigate('/');
    } catch (e) {
      setError(e.message);
    }
  };

  if (needsLogin) return <AdminLogin onSuccess={load} />;
  if (!data && !error) return <CenteredSpinner />;
  if (error && !data) {
    return (
      <div>
        <TopBar title="Quizly" subtitle="Error" />
        <Container narrow>
          <ErrorBanner message={error} />
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" icon={Icon.ArrowLeft}>Back to dashboard</Button>
          </Link>
        </Container>
      </div>
    );
  }

  const shareUrl = window.location.origin + '/quiz/' + data.id;
  const attempts = data.attempts;
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.scorePct, 0) / attempts.length) : null;
  const best = attempts.length ? Math.max(...attempts.map(a => a.scorePct)) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Quizly"
        subtitle="Quiz details"
        right={
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" icon={Icon.ArrowLeft}>Dashboard</Button>
          </Link>
        }
      />

      <Container>
        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {/* Quiz info */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8 }}>
                {data.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge>{data.questionCount} questions</Badge>
                <Badge>{data.sourceUrls.length} source{data.sourceUrls.length !== 1 ? 's' : ''}</Badge>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
                  Created {formatDate(data.createdAt)}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={remove} icon={Icon.Trash}>Delete</Button>
          </div>

          {/* Share URL */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            marginBottom: 16,
          }}>
            <Icon.Link size={14} />
            <span style={{
              flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {shareUrl}
            </span>
            <CopyButton text={shareUrl} label="Copy link" />
          </div>

          {/* Sources */}
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Sources
          </div>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
            {data.sourceUrls.map((u, i) => (
              <li key={i} style={{ fontSize: 13, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-4)', fontSize: 11 }}>{String(i + 1).padStart(2, '0')}</span>
                <a href={u} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {u}
                </a>
              </li>
            ))}
          </ul>

          {/* Preview toggle */}
          <button
            onClick={() => setShowQuestions(s => !s)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 500,
              color: 'var(--text-2)',
              padding: '6px 10px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface)',
            }}
          >
            {showQuestions ? <Icon.ChevronDown size={14} /> : <Icon.ChevronRight size={14} />}
            {showQuestions ? 'Hide' : 'Preview'} questions ({data.questions.length})
          </button>

          {showQuestions && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.questions.map((q, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Q{i + 1}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>{q.question}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {q.options.map((opt, j) => (
                      <div key={j} style={{
                        fontSize: 13,
                        color: j === q.correctIndex ? 'var(--success-text)' : 'var(--text-2)',
                        fontWeight: j === q.correctIndex ? 500 : 400,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: 4,
                          background: j === q.correctIndex ? 'var(--success-soft)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 600,
                          color: j === q.correctIndex ? 'var(--success-text)' : 'var(--text-3)',
                          border: j === q.correctIndex ? 'none' : '1px solid var(--border)',
                        }}>
                          {String.fromCharCode(65 + j)}
                        </span>
                        {opt}
                        {j === q.correctIndex && <Icon.Check size={13} />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stats */}
        {attempts.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12, marginBottom: 24,
          }}>
            <StatCard label="Attempts" value={attempts.length} icon={Icon.Users} />
            <StatCard label="Average" value={avg + '%'} icon={Icon.Trophy} />
            <StatCard label="Best" value={best + '%'} icon={Icon.Sparkles} />
          </div>
        )}

        {/* Attempts */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>
            Attempts
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            Everyone who's taken this quiz, most recent first.
          </p>
        </div>

        {attempts.length === 0 ? (
          <EmptyState
            icon={Icon.Users}
            title="No attempts yet"
            description="Share the quiz URL above with your designers. Their results will show up here."
          />
        ) : (
          <Card padding="0">
            {attempts.map((a, idx) => (
              <AttemptRow
                key={a.id}
                attempt={a}
                questions={data.questions}
                isLast={idx === attempts.length - 1}
                expanded={expandedAttempt === a.id}
                onToggle={() => setExpandedAttempt(expandedAttempt === a.id ? null : a.id)}
              />
            ))}
          </Card>
        )}
      </Container>
    </div>
  );
}

function StatCard({ label, value, icon: I }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', fontSize: 12, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <I size={13} />
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function AttemptRow({ attempt: a, questions, isLast, expanded, onToggle }) {
  const v = verdictFor(a.scorePct);
  return (
    <div style={{ borderBottom: !isLast || expanded ? '1px solid var(--border)' : 'none' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left',
          padding: '14px 20px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto auto',
          gap: 16, alignItems: 'center',
          background: expanded ? 'var(--surface-2)' : 'transparent',
          transition: 'background 0.15s',
        }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--surface-2)',
          color: 'var(--text-2)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 600, fontSize: 13,
          border: '1px solid var(--border)',
        }}>
          {a.takerName.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{a.takerName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{formatDate(a.completedAt)}</div>
        </div>
        <Badge variant={v.variant}>{v.label}</Badge>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{a.scorePct}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.correctCount} / {a.totalCount}</div>
        </div>
        <div style={{ color: 'var(--text-3)' }}>
          {expanded ? <Icon.ChevronDown size={16} /> : <Icon.ChevronRight size={16} />}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', background: 'var(--surface-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map((q, i) => {
              const given = a.answers[i];
              const ok = given === q.correctIndex;
              return (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '12px 14px',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 12,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 22, height: 22,
                    background: ok ? 'var(--success-soft)' : 'var(--danger-soft)',
                    color: ok ? 'var(--success-text)' : 'var(--danger-text)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    {ok ? <Icon.Check size={13} /> : <Icon.X size={13} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>
                      Q{i + 1}. {q.question}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div>
                        <span style={{ color: 'var(--text-4)' }}>Answered: </span>
                        <span style={{ color: ok ? 'var(--success-text)' : 'var(--danger-text)' }}>
                          {given !== null && given !== undefined ? q.options[given] : '(no answer)'}
                        </span>
                      </div>
                      {!ok && (
                        <div>
                          <span style={{ color: 'var(--text-4)' }}>Correct: </span>
                          <span style={{ color: 'var(--success-text)' }}>{q.options[q.correctIndex]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
