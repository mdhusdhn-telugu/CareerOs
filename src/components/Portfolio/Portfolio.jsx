import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaPlus, FaTrash, FaSave, FaExternalLinkAlt, FaCode, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import Scene from "../Homepage/Scene";
import "./Portfolio.css"; // We will build a single, powerful CSS file next

const Portfolio = () => {
  const { userId } = useParams(); // If present, we are viewing someone else
  const { user } = useAuth(); // Current logged in user
  
  // Logic: Are we Editing (Dashboard) or Viewing (Public)?
  const isPublicView = !!userId; 
  const isOwner = user && !userId; // Accessing /portfolio directly

  const [data, setData] = useState({
    name: "",
    photoURL: "",
    tagline: "",
    bio: "",
    github: "",
    linkedin: "",
    contactEmail: "",
    skills: [],
    projects: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Editor Input States
  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState({ title: "", description: "", link: "" });

  // --- FETCH DATA ---
  useEffect(() => {
    const targetId = isPublicView ? userId : user?.uid;
    if (!targetId) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", targetId);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          const userData = snap.data();
          setData({
            name: userData.name || "",
            photoURL: userData.photoURL || "https://via.placeholder.com/150",
            ...userData.portfolio // Spread existing portfolio data
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, user, isPublicView]);

  // --- SAVE HANDLER (Editor Only) ---
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        portfolio: {
            tagline: data.tagline || "",
            bio: data.bio || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            contactEmail: data.contactEmail || "",
            skills: data.skills || [],
            projects: data.projects || []
        }
      }, { merge: true });
      setTimeout(() => setSaving(false), 800);
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  // --- HELPER FUNCTIONS ---
  const handleInputChange = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  
  const addSkill = () => {
    if (skillInput.trim()) {
      setData(prev => ({ ...prev, skills: [...(prev.skills || []), skillInput] }));
      setSkillInput("");
    }
  };
  const removeSkill = (index) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const addProject = () => {
    if (projectInput.title.trim()) {
      setData(prev => ({ ...prev, projects: [...(prev.projects || []), projectInput] }));
      setProjectInput({ title: "", description: "", link: "" });
    }
  };
  const removeProject = (index) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  if (loading) return <div className="portfolio-loader">SYSTEM LOADING...</div>;

  // ==========================================
  // VIEW 1: THE PUBLIC PORTFOLIO ("Million Dollar View")
  // ==========================================
  if (isPublicView) {
    return (
      <div className="portfolio-public-wrapper">
        <div className="portfolio-bg-layer">
          <Scene /> {/* Reusing your Starfield */}
          <div className="portfolio-overlay"></div>
        </div>

        <div className="portfolio-content-container">
          <motion.header 
            className="portfolio-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="status-pill"><span className="dot-pulse"></span> Available for Work</div>
          </motion.header>

          <div className="bento-grid">
            {/* Hero Card */}
            <motion.div className="bento-box hero-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="hero-flex">
                <img src={data.photoURL} alt={data.name} className="hero-avatar" />
                <div className="hero-details">
                  <h1>{data.name}</h1>
                  <p className="gradient-text">{data.tagline || "Digital Creator"}</p>
                  <div className="location-tag"><FaMapMarkerAlt /> Remote / Worldwide</div>
                </div>
              </div>
            </motion.div>

            {/* Socials Card */}
            <motion.div className="bento-box social-box" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h3>Connect</h3>
              <div className="social-stack">
                {data.github && <a href={data.github} target="_blank" rel="noreferrer" className="social-row"><FaGithub /> GitHub <span>↗</span></a>}
                {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="social-row"><FaLinkedin /> LinkedIn <span>↗</span></a>}
                {data.contactEmail && <a href={`mailto:${data.contactEmail}`} className="social-row"><FaEnvelope /> Email <span>↗</span></a>}
              </div>
            </motion.div>

            {/* Bio Card */}
            {data.bio && (
              <motion.div className="bento-box bio-box" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <h3>About</h3>
                <p>{data.bio}</p>
              </motion.div>
            )}

            {/* Skills Card */}
            <motion.div className="bento-box skills-box" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h3>Tech Stack</h3>
              <div className="skill-cloud">
                {data.skills?.map((s, i) => <span key={i} className="skill-chip">{s}</span>)}
              </div>
            </motion.div>

            {/* Projects Section */}
            <div className="full-width-box">
              <h2>Selected Works</h2>
              <div className="projects-grid">
                {data.projects?.map((p, i) => (
                  <motion.div 
                    key={i} 
                    className="project-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="project-icon"><FaCode /></div>
                    <h4>{p.title}</h4>
                    <p>{p.description}</p>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="project-link">View Project <FaExternalLinkAlt /></a>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <footer className="portfolio-footer">
            <p>© {new Date().getFullYear()} {data.name}. Powered by <span style={{color: '#fff', fontWeight: 'bold'}}>CodeAstra</span>.</p>
          </footer>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE EDITOR (Private Dashboard)
  // ==========================================
  if (isOwner) {
    return (
      <div className="editor-wrapper">
        <div className="editor-max-width">
          
          <header className="editor-top-bar">
            <div>
              <h1>Portfolio Config</h1>
              <p className="editor-sub">Customize your public presence</p>
            </div>
            <div className="editor-actions">
              <Link to={`/portfolio/${user.uid}`} target="_blank" className="btn-outline">
                <FaExternalLinkAlt /> Live Preview
              </Link>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </header>

          <div className="editor-layout">
            {/* Identity Card */}
            <section className="editor-card">
              <h3><span className="num">01</span> Identity</h3>
              <div className="input-group">
                <label>Display Name</label>
                <input value={data.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Full Name" />
              </div>
              <div className="input-group">
                <label>Tagline</label>
                <input value={data.tagline} onChange={(e) => handleInputChange("tagline", e.target.value)} placeholder="e.g. Full Stack Developer" />
              </div>
              <div className="input-group">
                <label>Bio</label>
                <textarea rows="4" value={data.bio} onChange={(e) => handleInputChange("bio", e.target.value)} placeholder="Tell your story..." />
              </div>
            </section>

            {/* Socials Card */}
            <section className="editor-card">
              <h3><span className="num">02</span> Connections</h3>
              <div className="input-group">
                <label>GitHub URL</label>
                <input value={data.github} onChange={(e) => handleInputChange("github", e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div className="input-group">
                <label>LinkedIn URL</label>
                <input value={data.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input value={data.contactEmail} onChange={(e) => handleInputChange("contactEmail", e.target.value)} placeholder="public@email.com" />
              </div>
            </section>

            {/* Skills Card */}
            <section className="editor-card full-span">
              <h3><span className="num">03</span> Tech Stack</h3>
              <div className="add-row">
                <input 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add skill (e.g. React)" 
                />
                <button className="btn-icon" onClick={addSkill}><FaPlus /></button>
              </div>
              <div className="tags-wrapper">
                {data.skills?.map((s, i) => (
                  <span key={i} className="editor-tag">{s} <FaTrash onClick={() => removeSkill(i)} className="trash" /></span>
                ))}
              </div>
            </section>

            {/* Projects Card */}
            <section className="editor-card full-span">
              <h3><span className="num">04</span> Projects</h3>
              <div className="project-adder">
                <input 
                  value={projectInput.title} 
                  onChange={(e) => setProjectInput({...projectInput, title: e.target.value})} 
                  placeholder="Project Title" 
                />
                <input 
                  value={projectInput.link} 
                  onChange={(e) => setProjectInput({...projectInput, link: e.target.value})} 
                  placeholder="Project Link" 
                />
                <textarea 
                  value={projectInput.description} 
                  onChange={(e) => setProjectInput({...projectInput, description: e.target.value})} 
                  placeholder="Short description..." 
                  className="full-width-input"
                />
                <button className="btn-secondary full-width-btn" onClick={addProject}>+ Add Project</button>
              </div>

              <div className="projects-list-editor">
                {data.projects?.map((p, i) => (
                  <div key={i} className="project-item">
                    <div>
                      <strong>{p.title}</strong>
                      <div className="sub-text">{p.description}</div>
                    </div>
                    <button onClick={() => removeProject(i)} className="btn-icon-danger"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Portfolio;