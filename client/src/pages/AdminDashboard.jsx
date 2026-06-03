import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TopBar, Container, Card, Button, Badge, Icon,
  CenteredSpinner, EmptyState, ErrorBanner, CopyButton, formatDate,
} from '../components/ui.jsx';
import AdminLogin from '../components/AdminLogin.jsx';
import { api } from '../api.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [variants, setVariants] = useState(null);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);

  const load = async () => {
    setError('');
    try {
      const list = await api.listVariants();
      setVariants(list);
      setNeedsLogin(false);
    } catch (e) {
      if (e.code === 401) {
        setNeedsLogin(true);
      } else {
        setError(e.message);
        setVariants([]);
      }
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its attempts?`)) return;
    try {
      await api.deleteVariant(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (needsLogin) return <AdminLogin onSuccess={load} />;
  if (variants === null) return <CenteredSpinner />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Dodo Testing Platform"
        subtitle="Designer & Developer Knowledge Testing"
        right={<Badge variant="brand">Admin</Badge>}
      />

      <Container>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 4 }}>
              Quizzes
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
              Create quiz variants, share unique URLs, and review results.
            </p>
          </div>
          <Button onClick={() => navigate('/new')} icon={Icon.Plus} size="lg">
            New quiz
          </Button>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        {variants.length === 0 ? (
          <EmptyState
            icon={Icon.FileText}
            title="No quizzes yet"
            description="Create your first quiz to start testing designers on reference material."
            action={<Button onClick={() => navigate('/new')} icon={Icon.Plus}>Create your first quiz</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {variants.map(v => (
              <VariantRow key={v.id} variant={v} onDelete={() => remove(v.id, v.name)} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function VariantRow({ variant: v, onDelete }) {
  const shareUrl = window.location.origin + '/quiz/' + v.id;
  return (
    <Card padding="20px" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        alignItems: 'flex-start',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Link to={`/variant/${v.id}`} style={{
              fontSize: 17, fontWeight: 600, color: 'var(--text)',
              textDecoration: 'none', letterSpacing: '-0.01em',
            }}>
              {v.name}
            </Link>
            <Badge>{v.questionCount} questions</Badge>
            <Badge>{v.sourceUrls.length} source{v.sourceUrls.length !== 1 ? 's' : ''}</Badge>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-3)', flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Users size={13} />
              {v.attemptCount} attempt{v.attemptCount !== 1 ? 's' : ''}
            </span>
            {v.avgScore !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon.Trophy size={13} />
                {v.avgScore}% average
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Clock size={13} />
              Created {formatDate(v.createdAt)}
            </span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px 6px 12px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, color: 'var(--text-2)',
            maxWidth: 480,
          }}>
            <Icon.Link size={12} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareUrl}
            </span>
            <CopyButton text={shareUrl} label="Copy link" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <Link to={`/variant/${v.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm" iconRight={Icon.ChevronRight}>View results</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onDelete} icon={Icon.Trash}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}
