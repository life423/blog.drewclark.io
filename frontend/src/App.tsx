import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${apiUrl}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));
  }, [apiUrl]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map(post => (
          <article key={post.id} className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <time className="text-sm text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </article>
        ))
      )}
    </div>
  );
}

export default App;