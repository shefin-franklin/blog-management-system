import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { AiLog } from '../models/misc.js';

const getModel = () => {
  if (!env.geminiApiKey) return null;
  return new GoogleGenerativeAI(env.geminiApiKey).getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export async function generateAI({ feature, prompt, user }) {
  const model = getModel();
  let text;

  if (model) {
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } else {
    text = localAI(feature, prompt);
  }

  await AiLog.create({ user, feature, prompt, response: text });
  return text;
}

function localAI(feature, prompt) {
  const input = prompt.slice(0, 140);

  return JSON.stringify({
    title: `${feature} for ${input}`.slice(0, 70),
    summary: `AI-ready response generated from configured prompt: ${input}`,
    tags: ['mern', 'blog', 'ai', 'seo'],
    metaDescription: `Optimized content about ${input}`.slice(0, 155),
    content: `# ${feature}\n\n${input}\n\nThis draft is structured for clarity, search visibility, and reader engagement.`,
  });
}

export async function moderateComment(content, user) {
  const raw = await generateAI({
    feature: 'moderation',
    prompt: `Return JSON toxicity and spam scores for: ${content}`,
    user,
  });

  try {
    return JSON.parse(raw);
  } catch {
    return {
      toxicity: 0.05,
      spam: /https?:\/\//i.test(content) ? 0.7 : 0.05,
      reason: 'Rule-assisted moderation',
    };
  }
}
