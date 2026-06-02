import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { db, init as initDb } from './db.js';
import { generateQuestionsFromSources } from './claude.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const CLIENT_DIST = path.join(PROJECT_ROOT, 'client', 'dist');
const HAS_BUILD = fs.existsSync(CLIENT_DIST);
const MAX_FOCUS_LEN = 2000;

initDb();

const app = express();
app.use(express.json({ limit: '2mb' }));

// --- Admin auth ---
function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) return next();
  const provided = req.headers['x-admin-password'];
  if (provided !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Admin password required.' });
  }
  next();
}

// --- Health / config ---
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    requiresAdminPassword: !!ADMIN_PASSWORD,
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD) return res.json({ ok: true });
  if (password === ADMIN_PASSWORD) return res.json({ ok: true });
  return res.status(401).json({ error: 'Incorrect password.' });
});

// --- Variants (admin) ---
app.get('/api/admin/variants', requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT
      v.id, v.name, v.source_urls, v.question_count, v.created_at, v.focus_prompt,
      (SELECT COUNT(*) FROM attempts WHERE variant_id = v.id) AS attempt_count,
      (SELECT ROUND(AVG(score_pct)) FROM attempts WHERE variant_id = v.id) AS avg_score
    FROM variants v
    ORDER BY v.created_at DESC
  `).all();

  res.json(rows.map(r => ({
    id: r.id,
    name: r.name,
    sourceUrls: JSON.parse(r.source_urls),
    questionCount: r.question_count,
    focusPrompt: r.focus_prompt || '',
    attemptCount: r.attempt_count,
    avgScore: r.avg_score,
    createdAt: r.created_at,
  })));
});

app.post('/api/admin/variants', requireAdmin, async (req, res) => {
  try {
    const { name, sourceUrls, questionCount, focusPrompt } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!Array.isArray(sourceUrls) || sourceUrls.length === 0) {
      return res.status(400).json({ error: 'At least one source URL is required.' });
    }
    if (!sourceUrls.every(u => /^https?:\/\//.test(u))) {
      return res.status(400).json({ error: 'All sources must be http(s) URLs.' });
    }
    const qc = parseInt(questionCount, 10);
    if (isNaN(qc) || qc < 1 || qc > 50) {
      return res.status(400).json({ error: 'Question count must be between 1 and 50.' });
    }

    let cleanFocus = '';
    if (focusPrompt !== undefined && focusPrompt !== null) {
      if (typeof focusPrompt !== 'string') {
        return res.status(400).json({ error: 'Focus prompt must be a string.' });
      }
      cleanFocus = focusPrompt.trim().slice(0, MAX_FOCUS_LEN);
    }

    const questions = await generateQuestionsFromSources(sourceUrls, qc, cleanFocus);

    const id = nanoid(10);
    const now = Date.now();
    db.prepare(`
      INSERT INTO variants (id, name, source_urls, question_count, questions, focus_prompt, created_at, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name.trim(), JSON.stringify(sourceUrls), qc, JSON.stringify(questions), cleanFocus || null, now, now);

    res.json({ id, name: name.trim(), questionCount: questions.length });
  } catch (e) {
    console.error('[variants:create]', e);
    res.status(500).json({ error: e.message || 'Failed to create variant.' });
  }
});

app.get('/api/admin/variants/:id', requireAdmin, (req, res) => {
  const variant = db.prepare('SELECT * FROM variants WHERE id = ?').get(req.params.id);
  if (!variant) return res.status(404).json({ error: 'Variant not found.' });

  const attempts = db.prepare(`
    SELECT id, taker_name, answers, correct_count, total_count, score_pct, completed_at
    FROM attempts
    WHERE variant_id = ?
    ORDER BY completed_at DESC
  `).all(req.params.id);

  res.json({
    id: variant.id,
    name: variant.name,
    sourceUrls: JSON.parse(variant.source_urls),
    questionCount: variant.question_count,
    focusPrompt: variant.focus_prompt || '',
    questions: JSON.parse(variant.questions),
    createdAt: variant.created_at,
    attempts: attempts.map(a => ({
      id: a.id,
      takerName: a.taker_name,
      answers: JSON.parse(a.answers),
      correctCount: a.correct_count,
      totalCount: a.total_count,
      scorePct: a.score_pct,
      completedAt: a.completed_at,
    })),
  });
});

app.delete('/api/admin/variants/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM variants WHERE id = ?').run(req.params.id);
  res.json({ deleted: result.changes });
});

// --- Quiz taking (public) ---
app.get('/api/quiz/:variantId', (req, res) => {
  const variant = db.prepare('SELECT id, name, questions FROM variants WHERE id = ?').get(req.params.variantId);
  if (!variant) return res.status(404).json({ error: 'Quiz not found.' });

  const questions = JSON.parse(variant.questions).map(q => ({
    question: q.question,
    options: q.options,
  }));

  res.json({
    id: variant.id,
    name: variant.name,
    questions,
  });
});

app.post('/api/quiz/:variantId/attempts', (req, res) => {
  const { takerName, answers } = req.body || {};

  if (!takerName || typeof takerName !== 'string' || !takerName.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers must be an array.' });
  }

  const variant = db.prepare('SELECT id, questions FROM variants WHERE id = ?').get(req.params.variantId);
  if (!variant) return res.status(404).json({ error: 'Quiz not found.' });

  const questions = JSON.parse(variant.questions);
  if (answers.length !== questions.length) {
    return res.status(400).json({ error: 'Answer count does not match question count.' });
  }

  let correctCount = 0;
  const review = questions.map((q, i) => {
    const given = answers[i];
    const ok = given === q.correctIndex;
    if (ok) correctCount++;
    return {
      question: q.question,
      options: q.options,
      given,
      correctIndex: q.correctIndex,
      ok,
      sourceUrl: q.sourceUrl,
      sourceTitle: q.sourceTitle,
      explanation: q.explanation,
    };
  });

  const total = questions.length;
  const pct = Math.round((correctCount / total) * 100);
  const attemptId = nanoid(12);
  const now = Date.now();

  db.prepare(`
    INSERT INTO attempts (id, variant_id, taker_name, answers, correct_count, total_count, score_pct, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(attemptId, req.params.variantId, takerName.trim(), JSON.stringify(answers), correctCount, total, pct, now);

  res.json({
    attemptId,
    correctCount,
    totalCount: total,
    scorePct: pct,
    review,
  });
});

// --- Static SPA (production build) ---
if (HAS_BUILD) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
  console.log(`[server] mode: ${HAS_BUILD ? 'production (serving built client)' : 'dev (API only — run vite separately)'}`);
  if (!ADMIN_PASSWORD) {
    console.warn('[server] ⚠ ADMIN_PASSWORD not set — admin routes are open');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[server] ✗ ANTHROPIC_API_KEY not set — quiz generation will fail');
  }
});
