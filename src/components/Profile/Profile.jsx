import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

// Import Sub-components
import MyResumes from "./MyResumes";
import SavedJobs from "./SavedJobs"; // <--- CHANGED FROM APPLIED JOBS
import SavedQuestions from "./SavedQuestions";
import "./Profile.css";

// --- Form Component for Editing ---
const ProfileForm = ({ user, form, setForm, preview, handleFileChange, onSaveSuccess, onCancel }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const isPhoneValid = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!isPhoneValid(form.phone)) {
      setMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    setSaving(true);
    setMessage("");

    try {
      let photoURL = form.photoURL;

      if (form.photoFile) {
        setMessage("Uploading image...");
        const formData = new FormData();
        formData.append("image", form.photoFile);
        
        const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          formData
        );
        photoURL = res.data.data.url; 
      }

      setMessage("Saving profile...");
      const updatedData = { name: form.name, phone: form.phone, gender: form.gender, education: form.education, photoURL };
      await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
      await updateProfile(user, { displayName: form.name, photoURL });
      
      setForm({...updatedData, photoFile: null });
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        setMessage("");
        onSaveSuccess();
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-card">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSave}>
        <div className="profile-picture-row">
          <img src={preview || user.photoURL || "https://via.placeholder.com/90"} alt="Preview" className="profile-image-large" />
          <div className="file-input-container">
            <label htmlFor="profile-pic" className="file-input-label">Choose File</label>
            <input id="profile-pic" type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
            <span className="file-input-text">{form.photoFile ? form.photoFile.name : "No file selected"}</span>
          </div>
        </div>
        <div className="profile-form-row"><div className="profile-form-group"><label>Name</label><input type="text" name="name" value={form.name} onChange={handleChange} required /></div></div>
        <div className="profile-form-row"><div className="profile-form-group"><label>Phone</label><input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" maxLength="10" /></div><div className="profile-form-group"><label>Gender</label><select name="gender" value={form.gender} onChange={handleChange}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select></div></div>
        <div className="profile-form-row"><div className="profile-form-group full-width"><label>Education</label><input type="text" name="education" value={form.education} onChange={handleChange} placeholder="e.g., Bachelor's in Computer Science" /></div></div>
        {message && <div className={`message ${message.startsWith("Failed") ? "error" : "success"}`}>{message}</div>}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="save-btn" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
};

// --- Component for Viewing Data ---
const ProfileView = ({ form, onEditClick, user }) => (
  <div className="profile-card">
    <div className="view-header">
      <h2>Profile Information</h2>
      <button className="edit-btn" onClick={onEditClick}>Edit</button>
    </div>
    <div className="profile-picture-row">
      <img src={form.photoURL || user.photoURL || "https://via.placeholder.com/90"} alt="Profile" className="profile-image-large" />
    </div>
    <div className="view-info-grid">
      <div className="view-info-item"><label>Name</label><p>{form.name || 'Not specified'}</p></div>
      <div className="view-info-item"><label>Phone</label><p>{form.phone || 'Not specified'}</p></div>
      <div className="view-info-item"><label>Gender</label><p>{form.gender || 'Not specified'}</p></div>
      <div className="view-info-item"><label>Education</label><p>{form.education || 'Not specified'}</p></div>
    </div>
  </div>
);

// --- Main Profile Component ---
const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", gender: "", education: "", photoURL: "", photoFile: null });
  const [preview, setPreview] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      setForm({ ...data, photoFile: null });
      setPreview(data.photoURL || "");
    } else {
      const googleUserData = { name: user.displayName || user.email?.split("@")[0] || "", phone: "", gender: "", education: "", photoURL: user.photoURL || "", photoFile: null };
      setForm(googleUserData);
      setPreview(user.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancel = () => {
    fetchData();
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({...form, photoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try { await logout(); navigate("/"); }
    catch (error) { console.error("Logout failed:", error); }
    finally { setLogoutLoading(false); }
  };

  if (authLoading) return <div className="loading-container"><p>Loading user data...</p></div>;
  if (!user) { navigate("/login"); return null; }

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return isEditing ? (
          <ProfileForm user={user} form={form} setForm={setForm} preview={preview} handleFileChange={handleFileChange} onSaveSuccess={() => setIsEditing(false)} onCancel={handleCancel} />
        ) : (
          <ProfileView user={user} form={form} onEditClick={() => setIsEditing(true)} />
        );
      case "resumes": return <MyResumes />;
      case "saved_jobs": return <SavedJobs />; // <--- CHANGED FROM APPLIED JOBS
      case "saved": return <SavedQuestions />;
      default: return <ProfileView user={user} form={form} onEditClick={() => setIsEditing(true)} />;
    }
  };

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <div className="profile-header"><img src={preview || user.photoURL || "https://via.placeholder.com/90"} alt="Profile" className="profile-image" /><h3>{form.name || user.displayName || "User"}</h3></div>
        <nav className="profile-nav">
          <button className={`nav-btn ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}>Profile</button>
          <button className={`nav-btn ${activeView === 'resumes' ? 'active' : ''}`} onClick={() => setActiveView('resumes')}>My Resumes</button>
          
          {/* RENAMED BUTTON */}
          <button className={`nav-btn ${activeView === 'saved_jobs' ? 'active' : ''}`} onClick={() => setActiveView('saved_jobs')}>Saved Jobs</button>
          
          <button className={`nav-btn ${activeView === 'saved' ? 'active' : ''}`} onClick={() => setActiveView('saved')}>Saved Challenges</button>
        </nav>
        <button className="logout-btn" onClick={handleLogout} disabled={logoutLoading}>{logoutLoading ? "Logging out..." : "Logout"}</button>
      </aside>
      <main className="profile-content">{renderContent()}</main>
    </div>
  );
};

export default Profile;