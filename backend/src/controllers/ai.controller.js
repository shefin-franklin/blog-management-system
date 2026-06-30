import {send} from '../utils/api.js';import {generateAI,moderateComment} from '../ai/gemini.service.js';
export async function aiGenerate(req,res){send(res,{result:await generateAI({feature:req.body.feature,prompt:req.body.prompt,user:req.user._id})});}
export async function aiModerate(req,res){send(res,{result:await moderateComment(req.body.content,req.user._id)});}
