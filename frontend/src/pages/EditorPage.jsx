import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card } from '../components/ui/Card';
import RichEditor from '../features/editor/RichEditor';
import { api } from '../services/api';

const schema = z.object({
  title: z.string().min(5),
  slug: z.string().optional(),
  excerpt: z.string().min(10),
  status: z.enum(['draft', 'review', 'published', 'scheduled']),
});

export default function EditorPage() {
  const [content, setContent] = useState('<p></p>');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { status: 'draft' } });

  const save = async (values) => api.post('/blogs', { ...values, content });

  return (
    <Card>
      <h1 className="mb-6 text-3xl font-black">AI Rich Text Editor</h1>
      <form onSubmit={handleSubmit(save)} className="space-y-4">
        <input className="input" placeholder="Title" {...register('title')} />
        <input className="input" placeholder="Custom slug" {...register('slug')} />
        <textarea className="input" placeholder="Excerpt" {...register('excerpt')} />
        <select className="input" {...register('status')}>
          <option>draft</option>
          <option>review</option>
          <option>published</option>
          <option>scheduled</option>
        </select>
        <RichEditor value={content} onChange={setContent} />
        <button className="btn">Save article</button>
        <pre className="text-red-300">{Object.values(errors).map((error) => error.message).join(' ')}</pre>
      </form>
    </Card>
  );
}
