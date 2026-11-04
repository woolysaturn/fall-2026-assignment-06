import { Routes, Route } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CreateEditArticlePage from './pages/CreateEditArticlePage';

export default function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
        <h1><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Articles & Comments Portal</a></h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/articles/new" element={<CreateEditArticlePage />} />
          <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
          <Route path="/articles/:articleId/edit" element={<CreateEditArticlePage />} />
        </Routes>
      </main>
    </div>
  );
}