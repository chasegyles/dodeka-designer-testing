import React, { useState } from 'react';

export const Icon = {
  Plus: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>),
  Trash: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>),
  ArrowRight: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>),
  ArrowLeft: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>),
  Check: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>),
  X: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>),
  Link: ({ size = 14 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>),
  Copy: ({ size = 14 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
  Sparkles: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>),
  Refresh: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>),
  Settings: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  FileText: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  Clock: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Trophy: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>),
  User: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Users: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  ChevronDown: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  ChevronRight: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  Eye: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>),
  EyeOff: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>),
  Lock: ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
};

export function Button({ children, onClick, disabled, type, variant, size, icon: IconC, iconRight: IconR, fullWidth, style }) {
  const [hover, setHover] = useState(false);
  variant = variant || 'primary';
  size = size || 'md';
  const map = {
    primary: { bg: hover && !disabled ? 'var(--brand-hover)' : 'var(--brand)', color: '#fff', border: '1px solid transparent', shadow: hover && !disabled ? 'var(--shadow-md)' : 'var(--shadow-sm)' },
    secondary: { bg: hover && !disabled ? 'var(--surface-2)' : 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-strong)', shadow: 'var(--shadow-xs)' },
    ghost: { bg: hover && !disabled ? 'var(--surface-2)' : 'transparent', color: 'var(--text-2)', border: '1px solid transparent', shadow: 'none' },
    danger: { bg: hover && !disabled ? 'var(--danger-soft)' : 'transparent', color: 'var(--danger-text)', border: '1px solid transparent', shadow: 'none' },
    dangerSolid: { bg: hover && !disabled ? '#b91c1c' : 'var(--danger)', color: '#fff', border: '1px solid transparent', shadow: 'var(--shadow-sm)' },
  };
  const s = map[variant];
  const pad = size === 'sm' ? '6px 10px' : size === 'lg' ? '12px 20px' : '9px 16px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
  return (
    <button type={type || 'button'} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: s.bg, color: s.color, border: s.border, boxShadow: s.shadow,
        borderRadius: 'var(--radius)', padding: pad, fontSize: fs, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        width: fullWidth ? '100%' : 'auto',
        justifyContent: 'center', whiteSpace: 'nowrap',
        ...(style || {}),
      }}>
      {IconC && <IconC size={size === 'sm' ? 14 : 16} />}
      {children}
      {IconR && <IconR size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}

export function Card({ children, padding, style }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: padding ?? '24px',
      boxShadow: 'var(--shadow-xs)',
      ...(style || {}),
    }}>
      {children}
    </div>
  );
}

export function Badge({ children, variant }) {
  variant = variant || 'default';
  const map = {
    default: { bg: 'var(--surface-2)', color: 'var(--text-2)', border: 'var(--border)' },
    brand: { bg: 'var(--brand-soft)', color: 'var(--brand-text)', border: 'transparent' },
    success: { bg: 'var(--success-soft)', color: 'var(--success-text)', border: 'transparent' },
    danger: { bg: 'var(--danger-soft)', color: 'var(--danger-text)', border: 'transparent' },
    warning: { bg: 'var(--warning-soft)', color: 'var(--warning-text)', border: 'transparent' },
  };
  const s = map[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 999,
      background: s.bg, color: s.color, border: '1px solid ' + s.border,
      fontSize: 12, fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.01em',
    }}>
      {children}
    </span>
  );
}

export function TopBar({ title, subtitle, right }) {
  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, background: 'var(--text)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <Icon.Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, color: 'var(--text)' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.2, marginTop: 1 }}>{subtitle}</div>}
          </div>
        </a>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function Container({ children, narrow, style }) {
  return (
    <div style={{
      maxWidth: narrow ? 720 : 960,
      margin: '0 auto',
      padding: '32px',
      ...(style || {}),
    }}>
      {children}
    </div>
  );
}

export function Spinner({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '3px solid var(--border)',
      borderTopColor: 'var(--brand)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  );
}

export function CenteredSpinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  );
}

export function ScoreRing({ pct, variant, size }) {
  size = size || 120;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const colors = {
    success: 'var(--success)', brand: 'var(--brand)',
    default: 'var(--text-3)', danger: 'var(--danger)',
  };
  const color = colors[variant] || colors.default;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash + ' ' + c}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {pct}<span style={{ fontSize: 16, color: 'var(--text-3)' }}>%</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, marginTop: 2 }}>Score</div>
      </div>
    </div>
  );
}

export function OptionCard({ letter, text, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left',
        background: selected ? 'var(--brand-soft)' : (hover ? 'var(--surface-2)' : 'var(--surface)'),
        border: '1px solid ' + (selected ? 'var(--brand)' : (hover ? 'var(--border-strong)' : 'var(--border)')),
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
        transition: 'all 0.12s ease', cursor: 'pointer',
        boxShadow: selected ? '0 0 0 3px var(--brand-soft)' : 'none',
      }}>
      <div style={{
        width: 28, height: 28, flexShrink: 0,
        borderRadius: 'var(--radius-sm)',
        background: selected ? 'var(--brand)' : 'var(--surface-2)',
        color: selected ? '#fff' : 'var(--text-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 600,
        border: '1px solid ' + (selected ? 'var(--brand)' : 'var(--border)'),
        transition: 'all 0.12s ease',
      }}>{letter}</div>
      <div style={{
        fontSize: 15, lineHeight: 1.5,
        color: selected ? 'var(--brand-text)' : 'var(--text)',
        fontWeight: selected ? 500 : 400, paddingTop: 3,
      }}>{text}</div>
    </button>
  );
}

export function EmptyState({ icon: IconC, title, description, action }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 24px',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface)',
    }}>
      {IconC && (
        <div style={{
          width: 48, height: 48, margin: '0 auto 16px',
          background: 'var(--surface-2)', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-3)',
        }}>
          <IconC size={22} />
        </div>
      )}
      <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      {description && <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: action ? 20 : 0, maxWidth: 360, margin: '0 auto' }}>{description}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'var(--danger-soft)',
      border: '1px solid #fecaca',
      borderRadius: 'var(--radius)',
      padding: '12px 14px',
      marginBottom: 16,
      display: 'flex', alignItems: 'flex-start', gap: 10,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{ color: 'var(--danger-text)', flexShrink: 0, marginTop: 1 }}>
        <Icon.X size={16} />
      </div>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--danger-text)', lineHeight: 1.5, wordBreak: 'break-word' }}>
        {message}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{ color: 'var(--danger-text)', padding: 2, opacity: 0.7 }}>
          <Icon.X size={14} />
        </button>
      )}
    </div>
  );
}

export function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <Button variant="secondary" size="sm" onClick={copy} icon={copied ? Icon.Check : Icon.Copy}>
      {copied ? 'Copied' : (label || 'Copy')}
    </Button>
  );
}

export function formatDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  const min = 60 * 1000, hr = 60 * min, day = 24 * hr;
  if (diff < min) return 'just now';
  if (diff < hr) return Math.floor(diff / min) + 'm ago';
  if (diff < day) return Math.floor(diff / hr) + 'h ago';
  if (diff < 7 * day) return Math.floor(diff / day) + 'd ago';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function verdictFor(pct) {
  if (pct === 100) return { label: 'Perfect', variant: 'success', message: 'Every question answered correctly.' };
  if (pct >= 90) return { label: 'Excellent', variant: 'success', message: 'Strong performance with only minor gaps.' };
  if (pct >= 75) return { label: 'Good', variant: 'success', message: 'Solid understanding overall.' };
  if (pct >= 60) return { label: 'Pass', variant: 'brand', message: 'You passed, with room to improve.' };
  if (pct >= 40) return { label: 'Needs work', variant: 'default', message: 'Spend time with the references below.' };
  return { label: 'Retake recommended', variant: 'danger', message: 'Review the source material and try again.' };
}
