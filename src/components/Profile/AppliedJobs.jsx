// src/components/Profile/AppliedJobs.jsx
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
import axios from "axios";
import {
  IoLocationOutline,
  IoBriefcaseOutline,
  IoClose
} from "react-icons/io5";
import "./AppliedJobs.css";

const JobDetailModal = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose />
        </button>
        <div className="modal-header">
          <img src={job.employer_logo || "/images/default-logo.png"} alt={job.employer_name + " logo"} />
          <h2>{job.job_title}</h2>
          <p>{job.employer_name}</p>
        </div>
        <div className="modal-details">
          <span><IoLocationOutline /> {job.job_city || "NA"}</span>
          <span><IoBriefcaseOutline /> {job.job_employment_type || "Not specified"}</span>
          {job.job_is_remote && <span>Remote</span>}
        </div>
        <div className="modal-body">
          <h4>Job Description</h4>
          <p>{job.job_description || "No description provided."}</p>
        </div>
        <div className="modal-footer">
          {job.job_apply_link && (<a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="btn-apply">View Original Posting</a>)}
        </div>
      </div>
    </div>
  );
};

const AppliedJobs = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchApplied = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "users", user.uid, "appliedJobs"), orderBy("appliedAt", "desc"));
        const snap = await getDocs(q);
        const jobs = snap.docs.map(doc => {
          const data = doc.data();
          return {
            docId: doc.id,
            ...data
          };
        });
        setAppliedJobs(jobs);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplied();
  }, [user]);

  const handleViewDetails = async (jobId) => {
    setSelectedJob(null);
    try {
      const response = await axios.get(`https://jsearch.p.rapidapi.com/job-details`, {
        params: { job_id: jobId },
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_JSEARCH_API_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
      });
      const details = response.data?.data?.[0] || null;
      if (details) {
        setSelectedJob(details);
      } else {
        alert("Could not retrieve details for this job. It may no longer be available.");
      }
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      alert("Failed to fetch job details.");
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this application record?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "appliedJobs", docId));
      setAppliedJobs(prev => prev.filter(job => job.docId !== docId));
    } catch (err) {
      console.error("Error deleting applied job:", err);
      alert("Failed to delete the application record.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container profile-card">
        <p>Loading your applied jobs...</p>
      </div>
    );
  }

  return (
    <div className="applied-jobs-container profile-card">
      <h2>Applied Jobs</h2>
      {appliedJobs.length > 0 ? (
        <ul className="applied-job-list">
          {appliedJobs.map(job => (
            <li key={job.docId} className="applied-job-card">
              <div className="job-card-header">
                <img src={job.employer_logo || "/images/default-logo.png"} alt="logo" className="company-logo" />
                <div className="company-info">
                  <h3 className="job-title">{job.job_title}</h3>
                  <p className="company-name">{job.employer_name}</p>
                </div>
              </div>
              <div className="job-details">
                <span className="detail-item"><IoLocationOutline /> {job.job_city || "NA"}</span>
                <span className="detail-item"><IoBriefcaseOutline /> {job.job_employment_type || "NA"}</span>
              </div>
              <div className="job-card-footer">
                <button className="btn-view-details" onClick={() => handleViewDetails(job.job_id)}>View Details</button>
                <button className="btn-delete" onClick={() => handleDelete(job.docId)}><IoClose /></button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t applied to any jobs yet.</p>
      )}
      {selectedJob && (<JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />)}
    </div>
  );
};

export default AppliedJobs;