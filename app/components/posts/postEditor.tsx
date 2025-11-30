import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '../ui/button';
import { Image, Send } from 'lucide-react';
import { useFetcher } from 'react-router';
interface PostEditorProps {
  onSuccess?: () => void;
}
export function PostEditor({ onSuccess }: PostEditorProps) {
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const fetcher = useFetcher();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What's On Your Mind?"
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-4'
      }
    }
  });
  const handleSubmit = () => {
    if (!editor) return;
    const content = editor.getText();
    if (!content.trim()) return;
    const html = editor.getHTML();
    fetcher.submit(
      { content: html, mediaUrls: JSON.stringify(mediaUrls) },
      { method: 'post', action: '/api/posts/create' }
    );
    editor.commands.clearContent();
    setMediaUrls([]);
    onSuccess?.();
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrls([...mediaUrls, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <EditorContent editor={editor} />
      {mediaUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
          {mediaUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt="" className="h-24 w-24 object-cover rounded-lg" />
              <button
                onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Image className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </label>
        </div>
        <Button onClick={handleSubmit} disabled={fetcher.state === 'submitting'} size="sm">
          <Send className="h-4 w-4 mr-2" />
          {fetcher.state === 'submitting' ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  )
}