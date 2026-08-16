import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { FaGithub, FaLinkedin, FaEnvelope, FaPlus, FaTrash, FaSave, FaExternalLinkAlt, FaCode, FaMapMarkerAlt, FaCheckCircle, FaSync } from "react-icons/fa";
import { mapResumeToPortfolio, hasMeaningfulPortfolioData } from "../../utils/profileResumeSync";
import "./Portfolio.css";

// NOTE: This component is ONLY ever reachable at /portfolio (no :userId param) —
// see App.jsx. The public-facing viewer at /portfolio/:userId is a separate
// component, PublicPortfolio.jsx. This is purely the private editor/dashboard
// for the logged-in user's own portfolio.
//
// CROSS-SYNC: if the user built a resume before ever touching their
// Portfolio, we auto-import name/tagline/bio/skills/projects/experience/
// education/certifications/contact links from their most recent resume the
// first time they land here with an empty portfolio — see the useEffect
// below. This never overwrites data the user already entered directly here.

const EMPTY_PORTFOLIO = {
  name: "",
  photoURL: "",
  tagline: "",
  bio: "",
  location: "",
  quote: "",
  github: "",
  linkedin: "",
  contactEmail: "",
  skills: [],
  projects: [],
  experiences: [],
  education: [],
  certifications: [],
};

const Portfolio = () => {
  const { user } = useAuth();
  const isOwner = !!user;

  const [data, setData] = useState(EMPTY_PORTFOLIO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importNotice, setImportNotice] = useState("");

  // Editor Input States
  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState({ title: "", description: "", link: "", image: "", tags: "" });
  const [expInput, setExpInput] = useState({ title: "", company: "", duration: "", description: "" });
  const [eduInput, setEduInput] = useState({ degree: "", institution: "", duration: "", details: "" });
  const [certInput, setCertInput] = useState({ name: "", issuer: "" });

  // --- Pull the user's most recently updated resume, if any ---
  const fetchLatestResume = async () => {
    if (!user?.uid) return null;
    const q = query(
      collection(db, "users", user.uid, "resumes"),
      orderBy("updatedAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data();
  };

  // --- FETCH DATA (with cross-sync from resume if portfolio is empty) ---
  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        const userData = snap.exists() ? snap.data() : {};
        const existingPortfolio = userData.portfolio || {};

        if (hasMeaningfulPortfolioData(existingPortfolio)) {
          setData({
            ...EMPTY_PORTFOLIO,
            name: userData.name || "",
            photoURL: userData.photoURL || "https://via.placeholder.com/150",
            ...existingPortfolio,
          });
        } else {
          const latestResume = await fetchLatestResume();
          if (latestResume) {
            const imported = mapResumeToPortfolio(latestResume);
            setData({
              ...EMPTY_PORTFOLIO,
              name: userData.name || imported.name || "",
              photoURL: userData.photoURL || "https://via.placeholder.com/150",
              ...imported,
            });
            setImportNotice("We pre-filled this from your most recent resume — review and hit Save Changes to keep it.");
          } else {
            setData({
              ...EMPTY_PORTFOLIO,
              name: userData.name || "",
              photoURL: userData.photoURL || "https://via.placeholder.com/150",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // --- MANUAL RE-SYNC BUTTON ---
  const handleSyncFromResume = async () => {
    const latestResume = await fetchLatestResume();
    if (!latestResume) {
      setImportNotice("No saved resume found to sync from yet — build one first.");
      return;
    }
    const imported = mapResumeToPortfolio(latestResume);
    setData(prev => ({
      ...prev,
      tagline: imported.tagline || prev.tagline,
      bio: imported.bio || prev.bio,
      github: imported.github || prev.github,
      linkedin: imported.linkedin || prev.linkedin,
      contactEmail: imported.contactEmail || prev.contactEmail,
      skills: imported.skills.length ? imported.skills : prev.skills,
      projects: imported.projects.length ? imported.projects : prev.projects,
      experiences: imported.experiences.length ? imported.experiences : prev.experiences,
      education: imported.education.length ? imported.education : prev.education,
      certifications: imported.certifications.length ? imported.certifications : prev.certifications,
    }));
    setImportNotice("Synced from your most recent resume. Review below, then Save Changes.");
  };

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        authEmail: user.email || "", // verified account email — used for actually DELIVERING contact form messages, kept separate from the editable "Email" field below (which is just what's publicly displayed)
        portfolio: {
            tagline: data.tagline || "",
            bio: data.bio || "",
            location: data.location || "",
            quote: data.quote || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            contactEmail: data.contactEmail || "",
            skills: data.skills || [],
            projects: data.projects || [],
            experiences: data.experiences || [],
            education: data.education || [],
            certifications: data.certifications || [],
        }
      }, { merge: true });
      setImportNotice("");
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
      const tagsArray = projectInput.tags.split(",").map((t) => t.trim()).filter(Boolean);
      setData(prev => ({ ...prev, projects: [...(prev.projects || []), { ...projectInput, tags: tagsArray }] }));
      setProjectInput({ title: "", description: "", link: "", image: "", tags: "" });
    }
  };
  const removeProject = (index) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const addExperience = () => {
    if (expInput.title.trim()) {
      setData(prev => ({ ...prev, experiences: [...(prev.experiences || []), expInput] }));
      setExpInput({ title: "", company: "", duration: "", description: "" });
    }
  };
  const removeExperience = (index) => {
    setData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    if (eduInput.degree.trim()) {
      setData(prev => ({ ...prev, education: [...(prev.education || []), eduInput] }));
      setEduInput({ degree: "", institution: "", duration: "", details: "" });
    }
  };
  const removeEducation = (index) => {
    setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const addCertification = () => {
    if (certInput.name.trim()) {
      setData(prev => ({ ...prev, certifications: [...(prev.certifications || []), certInput] }));
      setCertInput({ name: "", issuer: "" });
    }
  };
  const removeCertification = (index) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== index) }));
  };

  if (loading) return <div className="portfolio-loader">SYSTEM LOADING...</div>;
  if (!isOwner) return null;

  return (
    <div className="editor-wrapper">
      <div className="editor-max-width">

        <header className="editor-top-bar">
          <div>
            <h1>Portfolio Config</h1>
            <p className="editor-sub">Customize your public presence</p>
          </div>
          <div className="editor-actions">
            <button className="btn-outline" onClick={handleSyncFromResume} type="button">
              <FaSync /> Sync from Resume
            </button>
            <Link to={`/portfolio/${user.uid}`} target="_blank" className="btn-outline">
              <FaExternalLinkAlt /> Live Preview
            </Link>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : <><FaSave /> Save Changes</>}
            </button>
          </div>
        </header>

        {importNotice && (
          <div className="import-notice">
            <FaCheckCircle /> {importNotice}
            <button className="import-notice-dismiss" onClick={() => setImportNotice("")} type="button">&times;</button>
          </div>
        )}

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
            <div className="input-group">
              <label>Location</label>
              <input value={data.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="e.g. Nandyal, Andhra Pradesh" />
            </div>
            <div className="input-group">
              <label>Personal Quote / One-liner</label>
              <input value={data.quote} onChange={(e) => handleInputChange("quote", e.target.value)} placeholder="e.g. Coding, coffee, repeat" />
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
              <input
                value={projectInput.image}
                onChange={(e) => setProjectInput({...projectInput, image: e.target.value})}
                placeholder="Screenshot URL (optional — makes the card look real)"
                className="full-width-input"
              />
              <input
                value={projectInput.tags}
                onChange={(e) => setProjectInput({...projectInput, tags: e.target.value})}
                placeholder="Tools used, comma-separated (e.g. React, Firebase, CSS)"
                className="full-width-input"
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

          {/* Experience Card */}
          <section className="editor-card full-span">
            <h3><span className="num">05</span> Experience</h3>
            <div className="project-adder">
              <input
                value={expInput.title}
                onChange={(e) => setExpInput({...expInput, title: e.target.value})}
                placeholder="Role (e.g. Software Engineer Intern)"
              />
              <input
                value={expInput.company}
                onChange={(e) => setExpInput({...expInput, company: e.target.value})}
                placeholder="Company"
              />
              <input
                value={expInput.duration}
                onChange={(e) => setExpInput({...expInput, duration: e.target.value})}
                placeholder="Duration (e.g. Jun 2024 - Aug 2024)"
              />
              <textarea
                value={expInput.description}
                onChange={(e) => setExpInput({...expInput, description: e.target.value})}
                placeholder="What did you do..."
                className="full-width-input"
              />
              <button className="btn-secondary full-width-btn" onClick={addExperience}>+ Add Experience</button>
            </div>

            <div className="projects-list-editor">
              {data.experiences?.map((e, i) => (
                <div key={i} className="project-item">
                  <div>
                    <strong>{e.title}</strong>{e.company ? ` — ${e.company}` : ""}
                    <div className="sub-text">{e.duration}</div>
                  </div>
                  <button onClick={() => removeExperience(i)} className="btn-icon-danger"><FaTrash /></button>
                </div>
              ))}
            </div>
          </section>

          {/* Education Card */}
          <section className="editor-card full-span">
            <h3><span className="num">06</span> Education</h3>
            <div className="project-adder">
              <input
                value={eduInput.degree}
                onChange={(e) => setEduInput({...eduInput, degree: e.target.value})}
                placeholder="Degree (e.g. B.C.A.)"
              />
              <input
                value={eduInput.institution}
                onChange={(e) => setEduInput({...eduInput, institution: e.target.value})}
                placeholder="Institution"
              />
              <input
                value={eduInput.duration}
                onChange={(e) => setEduInput({...eduInput, duration: e.target.value})}
                placeholder="Duration (e.g. 2022 - 2025)"
              />
              <input
                value={eduInput.details}
                onChange={(e) => setEduInput({...eduInput, details: e.target.value})}
                placeholder="Details (e.g. GPA: 9.0/10.0)"
              />
              <button className="btn-secondary full-width-btn" onClick={addEducation}>+ Add Education</button>
            </div>

            <div className="projects-list-editor">
              {data.education?.map((e, i) => (
                <div key={i} className="project-item">
                  <div>
                    <strong>{e.degree}</strong>{e.institution ? ` — ${e.institution}` : ""}
                    <div className="sub-text">{e.duration} {e.details ? `• ${e.details}` : ""}</div>
                  </div>
                  <button onClick={() => removeEducation(i)} className="btn-icon-danger"><FaTrash /></button>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications Card */}
          <section className="editor-card full-span">
            <h3><span className="num">07</span> Certifications</h3>
            <div className="project-adder">
              <input
                value={certInput.name}
                onChange={(e) => setCertInput({...certInput, name: e.target.value})}
                placeholder="Certificate Name"
              />
              <input
                value={certInput.issuer}
                onChange={(e) => setCertInput({...certInput, issuer: e.target.value})}
                placeholder="Issuer (e.g. Coursera, Udemy)"
              />
              <button className="btn-secondary full-width-btn" onClick={addCertification}>+ Add Certification</button>
            </div>

            <div className="projects-list-editor">
              {data.certifications?.map((c, i) => (
                <div key={i} className="project-item">
                  <div>
                    <strong>{c.name}</strong>
                    {c.issuer && <div className="sub-text">{c.issuer}</div>}
                  </div>
                  <button onClick={() => removeCertification(i)} className="btn-icon-danger"><FaTrash /></button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Portfolio;