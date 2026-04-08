import { useNavigate } from 'react-router-dom';
import PostComposer from '@/components/posts/PostComposer';
import { useCreatePost } from '@/hooks/usePosts';

export default function CreatePost() {
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const handleSave = (data: { caption: string; platforms: string[]; status: 'draft' | 'posted' }) => {
    createPost.mutate(
      { caption: data.caption, status: data.status },
      { onSuccess: () => navigate('/app/home') }
    );
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Create Post</h1>
      {createPost.error && (
        <p className="text-red-400 text-sm mb-4">{createPost.error.message}</p>
      )}
      <PostComposer onSave={handleSave} isLoading={createPost.isPending} />
    </div>
  );
}
