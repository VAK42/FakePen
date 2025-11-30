import { useState } from 'react';
import { useFetcher } from 'react-router';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
interface CommentInputProps {
  postId: number;
  onSuccess?: () => void;
}
export function CommentInput({ postId, onSuccess }: CommentInputProps) {
  const [content, setContent] = useState('');
  const fetcher = useFetcher();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    fetcher.submit(
      { postId: postId.toString(), content },
      { method: 'post', action: '/api/comments/create' }
    );
    setContent('');
    onSuccess?.();
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200 dark:border-gray-800">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write A Comment..."
        className="mb-2"
        rows={2}
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={!content.trim() || fetcher.state === 'submitting'}>
          {fetcher.state === 'submitting' ? 'Posting...' : 'Comment'}
        </Button>
      </div>
    </form>
  )
}