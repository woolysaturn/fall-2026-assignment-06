import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CommentsList from '../components/CommentsList';

interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/articles/${articleId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Article not found');
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [articleId]);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    fetch(`/articles/${articleId}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete article');
        navigate('/');
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <p>Loading article...</p>;
  if (error || !article) return <p style={{ color: 'red' }}>{error || 'Article not found'}</p>;

  return (
    <div>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>&larr; Back to Articles</Link>
      <article style={{ marginTop: '1rem' }}>
        <h2>{article.title}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
          <Link to={`/articles/${article.articleId}/edit`} style={{ padding: '0.4rem 0.8rem', background: '#ffc107', color: '#000', textDecoration: 'none', borderRadius: '4px' }}>
            Edit
          </Link>
          <button onClick={handleDelete} style={{ padding: '0.4rem 0.8rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{article.contents}</p>
      </article>

      <hr style={{ margin: '2rem 0' }} />
      <CommentsList articleId={Number(articleId)} />
    </div>
  );
}