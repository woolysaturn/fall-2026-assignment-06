import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchFilter = searchParams.get('title_contains') || '';
  const [searchInput, setSearchInput] = useState(searchFilter);

  useEffect(() => {
    setLoading(true);
    const url = searchFilter 
      ? `/articles?title_contains=${encodeURIComponent(searchFilter)}`
      : '/articles';

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch articles');
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ title_contains: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Articles</h2>
        <Link to="/articles/new" style={{ padding: '0.5rem 1rem', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
          Create Article
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Search</button>
        {searchFilter && (
          <button 
            type="button" 
            onClick={() => { setSearchInput(''); setSearchParams({}); }}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </form>

      {loading && <p>Loading articles...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p>No articles found.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {articles.map((art) => (
          <li key={art.articleId} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
            <h3>
              <Link to={`/articles/${art.articleId}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                {art.title}
              </Link>
            </h3>
            <p>{art.contents.length > 120 ? `${art.contents.substring(0, 120)}...` : art.contents}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}