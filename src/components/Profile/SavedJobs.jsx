// src/components/Profile/SavedJobs.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import {
  IoLocationOutline,
  IoBriefcaseOutline,
  IoTrashOutline,
  IoArrowForwardCircleOutline,
  IoBriefcase
} from "react-icons/io5";
import "./SavedJobs.css";

const SavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      try {
        // Fetching from 'saved_jobs' collection
        const q = query(
            collection(db, "users", user.uid, "saved_jobs"), 
            orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        const jobs = snap.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        setSavedJobs(jobs);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  const handleDelete = async (docId) => {
    if (!window.confirm("Remove this job from your saved list?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "saved_jobs", docId));
      setSavedJobs(prev => prev.filter(job => job.docId !== docId));
      
      // Optional: Update local storage to keep JobPostings.jsx in sync visually if user navigates back
      const currentLocal = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      const newLocal = currentLocal.filter(id => id !== docId);
      localStorage.setItem("savedJobs", JSON.stringify(newLocal));
      
    } catch (err) {
      console.error("Error deleting saved job:", err);
      alert("Failed to remove job.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container profile-card">
        <p>Syncing saved opportunities...</p>
      </div>
    );
  }

  return (
    <div className="saved-jobs-container profile-card">
      <div className="view-header">
        <h2>Saved Jobs</h2>
      </div>

      {savedJobs.length > 0 ? (
        <div className="saved-jobs-grid">
          {savedJobs.map(job => (
            <div key={job.docId} className="saved-job-card">
              <div className="card-left">
                <img 
                    src={job.employer_logo || "https://via.placeholder.com/60"} 
                    alt="logo" 
                    className="company-logo" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                />
                <div className="job-info">
                  <h3 className="job-title">{job.job_title}</h3>
                  <p className="company-name">{job.employer_name}</p>
                  
                  <div className="job-meta">
                    <span className="meta-tag">
                        <IoLocationOutline /> {job.job_city || "Remote"}
                    </span>
                    <span className="meta-tag">
                        <IoBriefcaseOutline /> {job.job_employment_type || "Full Time"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                {job.job_apply_link && (
                    <a 
                        href={job.job_apply_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-action apply"
                        title="Apply on Company Site"
                    >
                        Apply <IoArrowForwardCircleOutline />
                    </a>
                )}
                
                <button 
                    className="btn-action remove" 
                    onClick={() => handleDelete(job.docId)}
                    title="Remove from Saved"
                >
                    <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
           <IoBriefcase size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
           <p>No jobs saved yet.</p>
           <small>Bookmark roles from the Job Board to see them here.</small>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;