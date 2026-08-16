// src/components/ResumeBuilder/ResumeBuilder.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import html2pdf from "html2pdf.js";

import { generateResumeContent } from "./utils/geminiGenerator";
import {
  mapPortfolioToResume,
  hasMeaningfulResumeData,
} from "../../utils/profileResumeSync";

import TemplateAtlas from "./templates/TemplateAtlas";
import TemplateStalwart from "./templates/TemplateStalwart";
import TemplateATSClassic from "./templates/TemplateATSClassic";
import TemplateModern from "./templates/TemplateModern";
import TemplateClassic from "./templates/TemplateClassic";
import TemplateProfessional from "./templates/TemplateProfessional";
import TemplateExecutive from "./templates/TemplateExecutive";

import "./ResumeBuilder.css";

const TEMPLATES = [
  { id: "atlas", label: "Atlas (Recommended)", Component: TemplateAtlas },
  { id: "stalwart", label: "Stalwart", Component: TemplateStalwart },
  { id: "atsclassic", label: "ATS Classic", Component: TemplateATSClassic },
  { id: "modern", label: "Modern", Component: TemplateModern },
  { id: "classic", label: "Classic", Component: TemplateClassic },
  { id: "professional", label: "Professional", Component: TemplateProfessional },
  { id: "executive", label: "Executive", Component: TemplateExecutive },
];

const EMPTY_RESUME = {
  name: "",
  title: "",
  phone: "",
  location: "",
  email: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: [],
  languages: [],
  experience: [],
  education: [],
  projects: [],
  certificates: [],
};

// Realistic, professional placeholder content for fields the site's own
// data (Portfolio) has no source for — phone, location, education,
// certificates, languages, and (only if truly empty) one sample experience
// and project. This keeps a freshly-created resume looking like a genuine,
// full single page instead of sparse, while making it obvious these are
// examples meant to be replaced with the user's real info.
const DUMMY_DEFAULTS = {
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary:
    "Motivated and detail-oriented professional with a passion for building high-quality work and solving real-world problems. Quick learner, strong communicator, and effective collaborator in fast-paced team environments.",
  skills: ["Communication", "Problem Solving", "Teamwork", "Time Management", "Adaptability"],
  languages: ["English (Fluent)", "Spanish (Conversational)"],
  education: [
    { degree: "B.S. in Computer Science", institution: "State University", duration: "2019 - 2023", details: "" },
  ],
  certificates: [{ name: "Google Project Management Certificate" }],
  experience: [
    {
      role: "Software Engineer Intern",
      company: "TechNova Solutions",
      duration: "Jun 2022 - Aug 2022",
      description:
        "• Built and shipped features for a production web application used by 10,000+ users\n• Collaborated with a team of 5 engineers using Agile methodology\n• Reduced page load time by 30% through code optimization",
    },
  ],
  projects: [
    {
      name: "Personal Portfolio Website",
      description:
        "• Designed and built a responsive portfolio site using React and Tailwind CSS\n• Deployed via Netlify with continuous integration from GitHub",
    },
  ],
};

// Fills in ONLY the fields that are still empty — real/imported data always
// wins, dummy content only fills genuine gaps.
function fillGapsWithDummyData(resume) {
  const filled = { ...resume };
  Object.keys(DUMMY_DEFAULTS).forEach((key) => {
    const current = filled[key];
    const isEmpty = Array.isArray(current) ? current.length === 0 : !current;
    if (isEmpty) filled[key] = DUMMY_DEFAULTS[key];
  });
  return filled;
}

export default function ResumeBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("id");

  const [formData, setFormData] = useState(EMPTY_RESUME);
  const [templateId, setTemplateId] = useState("atlas");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [aiLoadingField, setAiLoadingField] = useState(null);

  // Temp inputs for list-style fields
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [expInput, setExpInput] = useState({ role: "", company: "", duration: "", description: "", subEntries: [] });
  const [subEntryInput, setSubEntryInput] = useState({ name: "", description: "" });
  const [eduInput, setEduInput] = useState({ degree: "", institution: "", duration: "", details: "" });
  const [projInput, setProjInput] = useState({ name: "", description: "" });
  const [certInput, setCertInput] = useState({ name: "" });

  // --- LOAD: existing resume (edit mode) OR cross-sync from Portfolio (new + empty) ---
  useEffect(() => {
    if (!user?.uid) return;

    const load = async () => {
      setLoading(true);
      try {
        if (resumeId) {
          // Editing an existing resume
          const snap = await getDoc(doc(db, "users", user.uid, "resumes", resumeId));
          if (snap.exists()) {
            const { updatedAt, ...rest } = snap.data();
            setFormData({ ...EMPTY_RESUME, ...rest });
          }
        } else {
          // New resume — if it would otherwise be empty, try seeding from Portfolio
          const userSnap = await getDoc(doc(db, "users", user.uid));
          const userData = userSnap.exists() ? userSnap.data() : {};
          const imported = mapPortfolioToResume(userData);
          const baseline = hasMeaningfulResumeData(imported)
            ? { ...EMPTY_RESUME, ...imported, name: imported.name || user.displayName || "" }
            : { ...EMPTY_RESUME, name: user.displayName || "" };

          setFormData(fillGapsWithDummyData(baseline));
          setNotice(
            hasMeaningfulResumeData(imported)
              ? "We pre-filled this from your Portfolio, and added example content (education, languages, etc.) for anything your Portfolio doesn't track yet — replace the examples with your real info before saving."
              : "We added example content to show what a complete single-page resume looks like — replace it with your real info before saving."
          );
        }
      } catch (err) {
        console.error("Error loading resume:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, resumeId]);

  // --- MANUAL "Import from Portfolio" (available any time, non-destructive per-field) ---
  const handleImportFromPortfolio = async () => {
    if (!user?.uid) return;
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) {
      setNotice("No Portfolio data found yet — fill out your Portfolio first.");
      return;
    }
    const imported = mapPortfolioToResume(userSnap.data());
    const merged = {
      ...formData,
      name: formData.name || imported.name,
      title: formData.title || imported.title,
      summary: formData.summary || imported.summary,
      email: formData.email || imported.email,
      linkedin: formData.linkedin || imported.linkedin,
      github: formData.github || imported.github,
      skills: formData.skills.length ? formData.skills : imported.skills,
      projects: formData.projects.length ? formData.projects : imported.projects,
    };
    setFormData(fillGapsWithDummyData(merged));
    setNotice("Imported from your Portfolio, with example content added for anything it doesn't cover. Review below, then Save.");
  };

  // --- FIELD HELPERS ---
  const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const removeFromList = (field, index) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput("");
  };

  const addLanguage = () => {
    if (!languageInput.trim()) return;
    setFormData((prev) => ({ ...prev, languages: [...prev.languages, languageInput.trim()] }));
    setLanguageInput("");
  };

  const addSubEntryToDraft = () => {
    if (!subEntryInput.name.trim()) return;
    setExpInput((prev) => ({ ...prev, subEntries: [...prev.subEntries, subEntryInput] }));
    setSubEntryInput({ name: "", description: "" });
  };

  const removeSubEntryFromDraft = (index) => {
    setExpInput((prev) => ({ ...prev, subEntries: prev.subEntries.filter((_, i) => i !== index) }));
  };

  const addExperience = () => {
    if (!expInput.role.trim()) return;
    setFormData((prev) => ({ ...prev, experience: [...prev.experience, expInput] }));
    setExpInput({ role: "", company: "", duration: "", description: "", subEntries: [] });
  };

  const addEducation = () => {
    if (!eduInput.degree.trim()) return;
    setFormData((prev) => ({ ...prev, education: [...prev.education, eduInput] }));
    setEduInput({ degree: "", institution: "", duration: "", details: "" });
  };

  const addProject = () => {
    if (!projInput.name.trim()) return;
    setFormData((prev) => ({ ...prev, projects: [...prev.projects, projInput] }));
    setProjInput({ name: "", description: "" });
  };

  const addCertificate = () => {
    if (!certInput.name.trim()) return;
    setFormData((prev) => ({ ...prev, certificates: [...prev.certificates, certInput] }));
    setCertInput({ name: "" });
  };

  // --- AI ASSIST (uses existing geminiGenerator.js) ---
  const handleAiGenerate = async (type, payload) => {
    setAiLoadingField(type);
    try {
      const text = await generateResumeContent(type, payload);
      if (!text) return;

      if (type === "summary") {
        setField("summary", text);
      } else if (type === "skills") {
        const parsed = text.split(",").map((s) => s.trim()).filter(Boolean);
        setFormData((prev) => ({ ...prev, skills: [...new Set([...prev.skills, ...parsed])] }));
      } else if (type === "experience") {
        setExpInput((prev) => ({ ...prev, description: text }));
      } else if (type === "project") {
        setProjInput((prev) => ({ ...prev, description: text }));
      }
    } finally {
      setAiLoadingField(null);
    }
  };

  // --- DOWNLOAD PDF (A4, matches the on-screen preview exactly) ---
  const handleDownloadPDF = () => {
    const element = document.getElementById("resume-preview-content");
    if (!element) return;

    const fileName = `${formData.name || "resume"}.pdf`.replace(/\s+/g, "_");

    html2pdf()
      .set({
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  // --- SAVE ---
  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      if (resumeId) {
        await setDoc(
          doc(db, "users", user.uid, "resumes", resumeId),
          { ...formData, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } else {
        const newDoc = await addDoc(collection(db, "users", user.uid, "resumes"), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        navigate(`/resume/builder?id=${newDoc.id}`, { replace: true });
      }
      setNotice("Resume saved.");
    } catch (err) {
      console.error("Error saving resume:", err);
      setNotice("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rb-loading">Loading builder...</div>;
  }

  const ActiveTemplate = TEMPLATES.find((t) => t.id === templateId)?.Component || TemplateAtlas;

  return (
    <div className="rb-wrapper">
      <div className="rb-toolbar">
        <div className="rb-toolbar-left">
          <button className="rb-btn-outline" onClick={handleImportFromPortfolio} type="button">
            Import from Portfolio
          </button>
          <select
            className="rb-template-select"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="rb-toolbar-right">
          <button className="rb-btn-outline" onClick={handleDownloadPDF} type="button">
            Download PDF
          </button>
          <button className="rb-btn-primary" onClick={handleSave} disabled={saving} type="button">
            {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rb-notice">
          {notice}
          <button className="rb-notice-dismiss" onClick={() => setNotice("")} type="button">&times;</button>
        </div>
      )}

      <div className="rb-body">
        {/* --- FORM PANE --- */}
        <div className="rb-form-pane">
          <section className="rb-section">
            <h3>Basics</h3>
            <input placeholder="Full Name" value={formData.name} onChange={(e) => setField("name", e.target.value)} />
            <input placeholder="Target Role / Title (e.g. Frontend Developer)" value={formData.title} onChange={(e) => setField("title", e.target.value)} />
            <div className="rb-grid-2">
              <input placeholder="Phone" value={formData.phone} onChange={(e) => setField("phone", e.target.value)} />
              <input placeholder="Location" value={formData.location} onChange={(e) => setField("location", e.target.value)} />
              <input placeholder="Email" value={formData.email} onChange={(e) => setField("email", e.target.value)} />
              <input placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setField("linkedin", e.target.value)} />
              <input placeholder="GitHub URL" value={formData.github} onChange={(e) => setField("github", e.target.value)} />
            </div>
          </section>

          <section className="rb-section">
            <div className="rb-section-header-row">
              <h3>Summary</h3>
              <button
                className="ai-generate-btn small"
                type="button"
                disabled={aiLoadingField === "summary"}
                onClick={() => handleAiGenerate("summary", { title: formData.title, location: formData.location })}
              >
                {aiLoadingField === "summary" ? "Generating..." : "✦ AI Generate"}
              </button>
            </div>
            <textarea rows="4" placeholder="Short professional summary..." value={formData.summary} onChange={(e) => setField("summary", e.target.value)} />
          </section>

          <section className="rb-section">
            <div className="rb-section-header-row">
              <h3>Skills</h3>
              <button
                className="ai-generate-btn small"
                type="button"
                disabled={aiLoadingField === "skills"}
                onClick={() => handleAiGenerate("skills", { title: formData.title })}
              >
                {aiLoadingField === "skills" ? "Generating..." : "✦ AI Suggest"}
              </button>
            </div>
            <div className="rb-add-row">
              <input placeholder="Add a skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
              <button className="rb-btn-icon" type="button" onClick={addSkill}>+</button>
            </div>
            <div className="rb-tag-wrap">
              {formData.skills.map((s, i) => (
                <span key={i} className="rb-tag">{s} <button type="button" onClick={() => removeFromList("skills", i)}>&times;</button></span>
              ))}
            </div>
          </section>

          <section className="rb-section">
            <h3>Languages</h3>
            <div className="rb-add-row">
              <input placeholder="e.g. English (Fluent)" value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLanguage()} />
              <button className="rb-btn-icon" type="button" onClick={addLanguage}>+</button>
            </div>
            <div className="rb-tag-wrap">
              {formData.languages.map((l, i) => (
                <span key={i} className="rb-tag">{l} <button type="button" onClick={() => removeFromList("languages", i)}>&times;</button></span>
              ))}
            </div>
          </section>

          <section className="rb-section">
            <h3>Experience</h3>
            <div className="rb-grid-2">
              <input placeholder="Role" value={expInput.role} onChange={(e) => setExpInput({ ...expInput, role: e.target.value })} />
              <input placeholder="Company" value={expInput.company} onChange={(e) => setExpInput({ ...expInput, company: e.target.value })} />
            </div>
            <input placeholder="Duration (e.g. Jan 2023 - Present)" value={expInput.duration} onChange={(e) => setExpInput({ ...expInput, duration: e.target.value })} />
            <div className="rb-section-header-row">
              <span className="rb-mini-label">Description</span>
              <button
                className="ai-generate-btn small"
                type="button"
                disabled={aiLoadingField === "experience"}
                onClick={() => handleAiGenerate("experience", { role: expInput.role, company: expInput.company })}
              >
                {aiLoadingField === "experience" ? "Generating..." : "✦ AI Generate"}
              </button>
            </div>
            <textarea rows="3" placeholder="One bullet per line, starting with •" value={expInput.description} onChange={(e) => setExpInput({ ...expInput, description: e.target.value })} />

            <div className="rb-subentry-box">
              <span className="rb-mini-label">Sub-entry (optional — e.g. a capstone project nested under this program)</span>
              <input placeholder="Sub-entry name" value={subEntryInput.name} onChange={(e) => setSubEntryInput({ ...subEntryInput, name: e.target.value })} />
              <textarea rows="2" placeholder="One bullet per line" value={subEntryInput.description} onChange={(e) => setSubEntryInput({ ...subEntryInput, description: e.target.value })} />
              <button className="rb-btn-secondary" type="button" onClick={addSubEntryToDraft}>+ Add Sub-entry</button>

              {expInput.subEntries.map((sub, i) => (
                <div key={i} className="rb-list-item rb-subentry-item">
                  <div><strong>{sub.name}</strong></div>
                  <button type="button" onClick={() => removeSubEntryFromDraft(i)}>&times;</button>
                </div>
              ))}
            </div>

            <button className="rb-btn-secondary" type="button" onClick={addExperience}>+ Add Experience</button>

            {formData.experience.map((exp, i) => (
              <div key={i} className="rb-list-item">
                <div>
                  <strong>{exp.role}</strong>{exp.company ? ` — ${exp.company}` : ""}
                  <div className="rb-sub-text">{exp.duration}</div>
                  {exp.subEntries && exp.subEntries.length > 0 && (
                    <div className="rb-sub-text">↳ {exp.subEntries.map((s) => s.name).join(", ")}</div>
                  )}
                </div>
                <button type="button" onClick={() => removeFromList("experience", i)}>&times;</button>
              </div>
            ))}
          </section>

          <section className="rb-section">
            <h3>Education</h3>
            <div className="rb-grid-2">
              <input placeholder="Degree" value={eduInput.degree} onChange={(e) => setEduInput({ ...eduInput, degree: e.target.value })} />
              <input placeholder="Institution" value={eduInput.institution} onChange={(e) => setEduInput({ ...eduInput, institution: e.target.value })} />
            </div>
            <input placeholder="Duration" value={eduInput.duration} onChange={(e) => setEduInput({ ...eduInput, duration: e.target.value })} />
            <input placeholder="Details (optional)" value={eduInput.details} onChange={(e) => setEduInput({ ...eduInput, details: e.target.value })} />
            <button className="rb-btn-secondary" type="button" onClick={addEducation}>+ Add Education</button>

            {formData.education.map((edu, i) => (
              <div key={i} className="rb-list-item">
                <div>
                  <strong>{edu.degree}</strong>{edu.institution ? ` — ${edu.institution}` : ""}
                  <div className="rb-sub-text">{edu.duration}</div>
                </div>
                <button type="button" onClick={() => removeFromList("education", i)}>&times;</button>
              </div>
            ))}
          </section>

          <section className="rb-section">
            <h3>Projects</h3>
            <input placeholder="Project Name" value={projInput.name} onChange={(e) => setProjInput({ ...projInput, name: e.target.value })} />
            <div className="rb-section-header-row">
              <span className="rb-mini-label">Description</span>
              <button
                className="ai-generate-btn small"
                type="button"
                disabled={aiLoadingField === "project"}
                onClick={() => handleAiGenerate("project", { name: projInput.name, skills: formData.skills.join(", ") })}
              >
                {aiLoadingField === "project" ? "Generating..." : "✦ AI Generate"}
              </button>
            </div>
            <textarea rows="3" placeholder="What did you build..." value={projInput.description} onChange={(e) => setProjInput({ ...projInput, description: e.target.value })} />
            <button className="rb-btn-secondary" type="button" onClick={addProject}>+ Add Project</button>

            {formData.projects.map((p, i) => (
              <div key={i} className="rb-list-item">
                <div><strong>{p.name}</strong></div>
                <button type="button" onClick={() => removeFromList("projects", i)}>&times;</button>
              </div>
            ))}
          </section>

          <section className="rb-section">
            <h3>Certificates</h3>
            <div className="rb-add-row">
              <input placeholder="Certificate name" value={certInput.name} onChange={(e) => setCertInput({ name: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addCertificate()} />
              <button className="rb-btn-icon" type="button" onClick={addCertificate}>+</button>
            </div>
            {formData.certificates.map((c, i) => (
              <div key={i} className="rb-list-item">
                <div>{c.name}</div>
                <button type="button" onClick={() => removeFromList("certificates", i)}>&times;</button>
              </div>
            ))}
          </section>
        </div>

        {/* --- LIVE PREVIEW PANE --- */}
        <div className="rb-preview-pane">
          <div className="rb-preview-scale">
            <ActiveTemplate data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}