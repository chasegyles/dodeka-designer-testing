const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5';

export async function generateQuestionsFromSources(sourceUrls, count, focusPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set.');
  }

  const sourceList = sourceUrls.map((u, i) => (i + 1) + '. ' + u).join('\n');

  // Build optional focus section. Kept clearly separated so the model treats it
  // as steering, not as overriding the structural instructions below.
  const focusSection = (focusPrompt && focusPrompt.trim())
    ? `\nADMIN FOCUS INSTRUCTIONS:\nThe admin who created this quiz wants questions to focus on the following. Treat this as guidance for WHICH topics, facts, or angles to test — but the questions must still be answerable from the source material above.\n\n"""\n${focusPrompt.trim()}\n"""\n`
    : '';

  const prompt = `You are a quiz generator. Use the web_search tool to fetch the content of each of the following source URLs, then create exactly ${count} multiple-choice questions distributed across these sources.

SOURCE URLS:
${sourceList}
${focusSection}
INSTRUCTIONS:
1. For each source URL, use web_search to find and read the content. Search using the page title or topic from the URL.
2. After researching all sources, produce ${count} factual multiple-choice questions distributed roughly evenly across the sources.
3. Each question must be answerable from one specific source.
4. Each question has exactly 4 options. Exactly one is correct. Distractors must be plausible but factually wrong.
5. Test specific facts (dates, events, names, numbers, relationships), not vague trivia.
${focusPrompt && focusPrompt.trim() ? '6. Prioritize questions that align with the ADMIN FOCUS INSTRUCTIONS above. If the focus calls for topics the sources do not cover, generate the closest related questions the sources do support rather than fabricating content.\n' : ''}
After researching, respond with ONLY a valid JSON object - no preamble, no markdown fences, no explanation:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "sourceUrl": "exact URL from the list above",
      "sourceTitle": "human-readable source title",
      "explanation": "1-2 sentence factual explanation"
    }
  ]
}

Generate exactly ${count} questions. Respond with JSON only.`;

  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${text.slice(0, 400)}`);
  }

  const data = await response.json();
  const text = data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');

  if (!text) throw new Error('Model returned no text.');

  let raw = text.trim().replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const match = raw.match(/\{[\s\S]*"questions"[\s\S]*\}/);
    if (!match) {
      throw new Error('Could not parse model response as JSON: ' + raw.slice(0, 200));
    }
    parsed = JSON.parse(match[0]);
  }

  if (!Array.isArray(parsed.questions)) {
    throw new Error('Response missing questions array.');
  }

  const valid = parsed.questions.filter(q =>
    q.question &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    typeof q.correctIndex === 'number' &&
    q.correctIndex >= 0 &&
    q.correctIndex < 4
  );

  if (!valid.length) throw new Error('No valid questions were produced.');
  return valid;
}
