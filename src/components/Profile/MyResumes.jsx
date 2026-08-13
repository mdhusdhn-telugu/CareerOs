// src/components/Profile/MyResumes.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import "./MyResumes.css";

const MyResumes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "resumes"),
          orderBy("updatedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const userResumes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResumes(userResumes);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResumes();
    }
  }, [user]);

  // --- THIS IS THE CORRECTED LINE ---
  const handleCreateNew = () => {
    navigate("/resume/builder");
  };

  const handleEdit = (id) => {
    // Navigate to the builder with the resume ID as a query parameter
    navigate(`/resume/builder?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "users", user.uid, "resumes", id));
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="my-resumes-container profile-card">
      <div className="my-resumes-header">
        <h2>My Resumes</h2>
        <button onClick={handleCreateNew} className="create-new-btn">
          Create New Resume
        </button>
      </div>

      {resumes.length > 0 ? (
        <ul className="resume-list">
          {resumes.map((resume) => (
            <li key={resume.id} className="resume-list-item">
              <div className="resume-info">
                <span className="resume-title">
                  {resume.name || "Untitled Resume"}
                </span>
                <span className="resume-date">
                  Last updated{" "}
                  {resume.updatedAt &&
                    new Date(
                      resume.updatedAt.seconds * 1000
                    ).toLocaleDateString()}
                </span>
              </div>
              <div className="resume-actions">
                <button
                  onClick={() => handleEdit(resume.id)}
                  className="action-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="action-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't created any resumes yet.</p>
      )}
    </div>
  );
};

export default MyResumes;