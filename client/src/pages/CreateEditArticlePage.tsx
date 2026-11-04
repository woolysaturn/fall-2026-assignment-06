import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function CreateEditArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const isEditing = Boolean(articleId);
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      fetch(`/articles/${articleId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContents(data.contents);
        })
        .catch(() => setErrorMsg('Failed to load article details for editing'));
    }
  }, [articleId, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contents.trim()) {
      setErrorMsg('Both title and contents are required.');
      return;
    }

    const url = isEditing ? `/articles/${articleId}` : '/articles';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, contents }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save article');
        return res.json();
      })
      .then((savedArticle) => {
        navigate(`/articles/${savedArticle.articleId}`);
      })
      .catch((err) => setErrorMsg(err.message));
  };

  return (
    <div>
      <Link to={isEditing ? `/articles/${articleId}` : '/'} style={{ textDecoration: 'none', color: '#007bff' }}>
        &larr; Cancel
      </Link>
      <h2>{isEditing ? 'Edit Article' : 'Create New Article'}</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Contents</label>
          <textarea
            rows={8}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.7rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isEditing ? 'Update Article' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}