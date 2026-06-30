import { generateAI, moderateComment } from '../ai/gemini.service.js';
import { send } from '../utils/api.js';

export async function aiGenerate(req, res) {
  const result = await generateAI({
    feature: req.body.feature,
    prompt: req.body.prompt,
    user: req.user._id,
  });

  send(res, { result });
}

export async function aiModerate(req, res) {
  const result = await moderateComment(req.body.content, req.user._id);
  send(res, { result });
}
