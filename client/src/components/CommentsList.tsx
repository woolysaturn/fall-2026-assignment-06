import { useEffect, useState } from 'react';

interface Comment {
  commentId: number;
  articleId: number;
  body: string;
}

interface CommentsListProps {
  articleId: number;
}

export default function CommentsList({ articleId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newBody, setNewBody] = useState('');
  const [addError, setAddError] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetch(`/articles/${articleId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error('Failed to load comments', err));
  }, [articleId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBody.trim()) {
      setAddError('Comment body cannot be empty.');
      return;
    }
    setAddError('');

    fetch(`/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: newBody }),
    })
      .then((res) => res.json())
      .then((createdComment) => {
        setComments((prev) => [...prev, createdComment]);
        setNewBody('');
      })
      .catch(() => setAddError('Failed to post comment'));
  };

  const handleDeleteComment = (commentId: number) => {
    fetch(`/articles/${articleId}/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      })
      .catch(() => alert('Failed to delete comment'));
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.commentId);
    setEditBody(comment.body);
    setEditError('');
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editBody.trim()) {
      setEditError('Comment body cannot be empty.');
      return;
    }

    fetch(`/articles/${articleId}/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editBody }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setComments((prev) => prev.map((c) => (c.commentId === commentId ? updated : c)));
        setEditingId(null);
        setEditBody('');
      })
      .catch(() => setEditError('Failed to update comment'));
  };

  return (
    <section>
      <h3>Comments</h3>

      {comments.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((comment) => (
            <li key={comment.commentId} style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '0.8rem', marginBottom: '0.8rem', borderRadius: '4px' }}>
              {editingId === comment.commentId ? (
                <div>
                  {editError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{editError}</p>}
                  <textarea
                    rows={3}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleUpdateComment(comment.commentId)} style={{ padding: '0.3rem 0.6rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ padding: '0.3rem 0.6rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', whiteSpace: 'pre-wrap' }}>{comment.body}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <button onClick={() => startEditing(comment)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.commentId)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0 }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4>Leave a Comment</h4>
        {addError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{addError}</p>}
        <textarea
          rows={3}
          placeholder="Write a comment..."
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Post Comment
        </button>
      </form>
    </section>
  );
}