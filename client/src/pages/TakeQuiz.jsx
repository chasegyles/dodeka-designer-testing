import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TopBar, Container, Card, Button, Badge, Icon, OptionCard,
  CenteredSpinner, ErrorBanner, ScoreRing, verdictFor,
} from '../components/ui.jsx';
import { api } from '../api.js';

export default function TakeQuiz() {
  const { id } = useParams();
  const [phase, setPhase] = useState('loading'); // loading, welcome, taking, submitting, results, error
  const [quiz, setQuiz] = useState(null);
  const [takerName, setTakerName] = useState('');
  const [answers, setAnswers] = useState([]);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const q = await api.getQuiz(id);
        setQuiz(q);
        setAnswers(Array(q.questions.length).fill(null));
        setPhase('welcome');
      } catch (e) {
        setError(e.message);
        setPhase('error');
      }
    })();
  }, [id]);

  const start = () => {
    if (!takerName.trim()) return;
    setPhase('taking');
  };

  const select = (i) => {
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
  };

  const submit = async () => {
    setPhase('submitting');
    setError('');
    try {
      const r = await api.submitAttempt(id, { takerName: takerName.trim(), answers });
      setResult(r);
      setPhase('results');
    } catch (e) {
      setError(e.message);
      setPhase('taking');
    }
  };

  if (phase === 'loading') return <CenteredSpinner />;
  if (phase === 'error') return <ErrorScreen message={error} />;
  if (phase === 'welcome') return <Welcome quiz={quiz} name={takerName} setName={setTakerName} onStart={start} />;
  if (phase === 'submitting') return <SubmittingScreen />;
  if (phase === 'results') return <ResultsScreen result={result} takerName={takerName} quizName={quiz.name} />;

  // 'taking'
  const q = quiz.questions[idx];
  const selected = answers[idx];
  const isLast = idx === quiz.questions.length - 1;
  const progress = ((idx + 1) / quiz.questions.length) * 100;
  const next = () => isLast ? submit() : setIdx(idx + 1);
  const prev = () => idx > 0 && setIdx(idx - 1);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Dodo Testing Platform"
        subtitle={quiz.name}
        right={<Badge variant="brand">{takerName}</Badge>}
      />
      <div style={{ height: 3, background: 'var(--border)', position: 'relative' }}>
        <div style={{
          height: '100%', width: progress + '%',
          background: 'var(--brand)', transition: 'width 0.3s ease',
        }} />
      </div>

      <Container narrow>
        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <div style={{ animation: 'fadeIn 0.3s ease' }} key={idx}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Badge variant="brand">Question {idx + 1}</Badge>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>of {quiz.questions.length}</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 28 }}>
            {q.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {q.options.map((opt, i) => (
              <OptionCard
                key={i}
                letter={String.fromCharCode(65 + i)}
                text={opt}
                selected={selected === i}
                onClick={() => select(i)}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <Button variant="secondary" onClick={prev} disabled={idx === 0} icon={Icon.ArrowLeft}>Previous</Button>
            <Button onClick={next} disabled={selected === null} iconRight={Icon.ArrowRight}>
              {isLast ? 'Submit quiz' : 'Next question'}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Welcome({ quiz, name, setName, onStart }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Quizly" subtitle="Designer Knowledge Testing" />
      <Container narrow>
        <Card padding="40px">
          <div style={{
            width: 48, height: 48,
            background: 'var(--brand-soft)', color: 'var(--brand)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Icon.Sparkles size={22} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8 }}>
            {quiz.name}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 24 }}>
            This quiz has {quiz.questions.length} multiple-choice questions. You can go back and change answers
            before submitting. There's no time limit.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); onStart(); }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="First and last name"
              autoFocus
              style={{ marginBottom: 20 }}
            />
            <Button type="submit" disabled={!name.trim()} fullWidth size="lg" iconRight={Icon.ArrowRight}>
              Start quiz
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
}

function SubmittingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Quizly" subtitle="Submitting" />
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
            <Icon.Check size={24} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Grading your quiz...</h2>
        </Card>
      </Container>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Quizly" />
      <Container narrow>
        <Card padding="32px">
          <div style={{
            width: 48, height: 48,
            background: 'var(--danger-soft)', color: 'var(--danger-text)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Icon.X size={24} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8 }}>
            Couldn't load the quiz
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 16 }}>{message}</p>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            The link may have expired or been deleted. Reach out to whoever sent it to you.
          </p>
        </Card>
      </Container>
    </div>
  );
}

function ResultsScreen({ result, takerName, quizName }) {
  const { correctCount, totalCount, scorePct, review } = result;
  const wrong = review.map((r, i) => ({ ...r, i })).filter(r => !r.ok);
  const v = verdictFor(scorePct);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Quizly" subtitle={quizName} right={<Badge variant={v.variant}>Complete</Badge>} />
      <Container>
        {/* Score hero */}
        <Card padding="0" style={{ marginBottom: 24, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
          <div style={{
            padding: '32px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 32, alignItems: 'center',
          }}>
            <ScoreRing pct={scorePct} variant={v.variant} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon.Trophy size={16} />
                <Badge variant={v.variant}>{v.label}</Badge>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
                Nice work, {takerName.split(' ')[0]}.
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-3)', marginBottom: 14 }}>
                {correctCount} of {totalCount} correct. {v.message}
              </p>

              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {review.map((r, i) => (
                  <div key={i} title={`Q${i+1}: ${r.ok ? 'Correct' : 'Incorrect'}`}
                    style={{
                      width: 24, height: 24, borderRadius: 'var(--radius-sm)',
                      background: r.ok ? 'var(--success-soft)' : 'var(--danger-soft)',
                      color: r.ok ? 'var(--success-text)' : 'var(--danger-text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    {r.ok ? <Icon.Check size={13} /> : <Icon.X size={13} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {wrong.length > 0 ? (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 2 }}>Review</h2>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
                {wrong.length} question{wrong.length !== 1 ? 's' : ''} answered incorrectly — links to source material below
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {wrong.map(r => (
                <WrongCard key={r.i} item={r} num={r.i + 1} />
              ))}
            </div>
          </div>
        ) : (
          <Card style={{ textAlign: 'center', padding: '32px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 12px',
              background: 'var(--success-soft)', color: 'var(--success-text)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon.Check size={24} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Perfect score</h3>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>No corrections to review.</p>
          </Card>
        )}
      </Container>
    </div>
  );
}

function WrongCard({ item, num }) {
  return (
    <Card padding="20px">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 24, height: 24,
          background: 'var(--danger-soft)', color: 'var(--danger-text)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
        }}>{num}</div>
        <Badge variant="danger">Incorrect</Badge>
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35, marginBottom: 14 }}>
        {item.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <AnswerRow label="Your answer" text={item.given !== null && item.given !== undefined ? item.options[item.given] : '(not answered)'} variant="danger" />
        <AnswerRow label="Correct answer" text={item.options[item.correctIndex]} variant="success" />
      </div>

      {item.explanation && (
        <div style={{
          fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55,
          padding: '12px 14px',
          background: 'var(--surface-2)', borderRadius: 'var(--radius)',
          marginBottom: 12,
        }}>
          {item.explanation}
        </div>
      )}

      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: 'var(--brand)', fontWeight: 500,
          textDecoration: 'none', padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)', background: 'var(--surface)',
        }}>
        <Icon.Link size={12} />
        {item.sourceTitle || item.sourceUrl}
      </a>
    </Card>
  );
}

function AnswerRow({ label, text, variant }) {
  const styles = {
    danger: { bg: 'var(--danger-soft)', color: 'var(--danger-text)', icon: Icon.X },
    success: { bg: 'var(--success-soft)', color: 'var(--success-text)', icon: Icon.Check },
  }[variant];
  const I = styles.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 14px',
      background: styles.bg, borderRadius: 'var(--radius)',
    }}>
      <div style={{ color: styles.color, paddingTop: 2 }}><I size={14} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: styles.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{text}</div>
      </div>
    </div>
  );
}
