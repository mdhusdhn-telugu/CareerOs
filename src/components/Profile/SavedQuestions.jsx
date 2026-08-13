// src/components/Profile/SavedQuestions.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Trash2, ExternalLink, Code } from 'lucide-react';
import './Profile.css'; 

const SavedQuestions = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "users", user.uid, "savedQuestions"), orderBy("savedAt", "desc"));
        const snap = await getDocs(q);
        setQuestions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchSaved();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bookmark?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "savedQuestions", id));
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (e) { alert("Delete failed"); }
  };

  if (loading) return <div style={{ color: '#888', padding: '2rem' }}>Loading...</div>;

  return (
    <div className="profile-card">
      <div className="view-header">
         <h2>Saved Challenges</h2>
      </div>
      
      {questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
           <Code style={{ margin: '0 auto 1rem', opacity: 0.3 }} size={64} />
           <p style={{ fontSize: '1.1rem' }}>No questions saved yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((q) => (
            <div key={q.id} className="saved-item-card">
               <div className="saved-item-info">
                  <div className="saved-item-tags">
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: q.difficulty === 'Medium' ? 'rgba(251, 191, 36, 0.15)' : 
                                  q.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : 
                                  'rgba(52, 211, 153, 0.15)',
                      color: q.difficulty === 'Medium' ? '#fbbf24' : 
                             q.difficulty === 'Hard' ? '#f87171' : 
                             '#34d399',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {q.difficulty || 'Easy'}
                    </span>
                    <span className="badge-topic">{q.topic || 'Coding'}</span>
                  </div>
                  <h3 className="saved-item-title">{q.title}</h3>
               </div>
               
               <div className="saved-item-actions" style={{ display: 'flex', gap: '16px' }}>
                 <button 
                    className="saved-action-btn practice" 
                    title="Practice"
                 >
                    {/* The size prop is here, but CSS will enforce it now */}
                    <ExternalLink />
                 </button>
                 
                 <button 
                    onClick={() => handleDelete(q.id)} 
                    className="saved-action-btn delete" 
                    title="Remove"
                 >
                    <Trash2 />
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedQuestions;