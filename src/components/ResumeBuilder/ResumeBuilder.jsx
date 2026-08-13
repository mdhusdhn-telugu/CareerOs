import React, { useState, useEffect } from "react";
import "./ResumeBuilder.css";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, doc, addDoc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import html2pdf from 'html2pdf.js';
import { generateResumeContent } from "./utils/geminiGenerator"; 

// Icons for the IDE look
import { FaMagic, FaFileExport, FaSave, FaSignOutAlt, FaPlus, FaTrash, FaSearchPlus, FaSearchMinus } from "react-icons/fa";

// Import Templates
import TemplateStalwart from "./templates/TemplateStalwart";
import TemplateATSClassic from "./templates/TemplateATSClassic";
import TemplateModern from "./templates/TemplateModern";
import TemplateClassic from "./templates/TemplateClassic";
import TemplateProfessional from "./templates/TemplateProfessional";

// --- Default Data Objects ---
const stalwartData = {
  name: "May Riley",
  title: "Restaurant Manager",
  email: "m.riley@live.com",
  phone: "(716) 555-0100",
  linkedin: "linkedin.com/in/m.riley",
  github: "",
  location: "Buffalo, New York",
  summary: "Friendly and engaging team player and leader able to inspire staff to perform their best. Detail oriented and experienced restaurant manager passionate about food and beverages.",
  experience: [{ company: "Contoso Bar and Grill", role: "Restaurant Manager", duration: "Sep 20XX - Present", description: "• Recruit, hire, train, and coach over 30 staff members...\n• Reduced costs by 7%...\n• Consistently exceed monthly sales goals by 10%..." }],
  education: [{ institution: "Bigtown College", degree: "B.S. in Business Administration", duration: "June 20XX", details: "" }],
  skills: ["Accounting", "POS systems", "Team Leadership", "Energetic"],
  projects: [],
  certificates: []
};

const atsClassicData = {
    name: "Danielle Brasseur",
    title: "Accountant",
    email: "danielle@example.com",
    phone: "(313) 555-0100",
    linkedin: "linkedin.com/in/danielleb",
    github: "",
    location: "Carson City, NV",
    summary: "Dynamic and detail-oriented accountant with expertise in GAAP and comprehensive public accounting experience.",
    experience: [
        { company: "Trey Research", role: "Accountant", duration: "March 20XX – Present", description: "• Provide accounting services for individuals and businesses.\n• Specialize in income tax preparation and audit support." }
    ],
    education: [{ institution: "Bellows College", degree: "B.S. Accounting", duration: "June 20XX", details: "GPA: 3.8" }],
    skills: ["Microsoft NAV Dynamics", "Tax codes", "Bookkeeping", "Communication"],
    projects: [],
    certificates: []
};

const modernData = {
  name: "Alta Parks",
  title: "Attorney",
  email: "alta@example.com",
  phone: "718.555.0100",
  linkedin: "linkedin.com/in/alta",
  github: "",
  location: "New York, NY",
  summary: "Analytical, energetic, and detail-oriented attorney with broad and deep experience in business and real estate matters.",
  experience: [
    { company: "Bandter Real Estate", role: "In-house counsel", duration: "March 20XX—present", description: "Draft, negotiate and enforce leases and purchase & sale agreements." },
  ],
  education: [{ institution: "Jasper University", degree: "Juris Doctor", duration: "June 20XX", details: "1st place in Moot Court" }],
  skills: ["Data analytics", "Legal writing", "Communication", "Organized"],
  projects: [],
  certificates: []
};

const classicData = {
    name: "Graham Barnes",
    title: "Web Developer",
    email: "Graham@EXAMPLE.COM",
    phone: "303.555.0123",
    linkedin: "linkedin.com/in/grahamb",
    github: "",
    location: "Denver, CO",
    summary: "To obtain a challenging web developer position in a dynamic and innovative organization.",
    experience: [
      { company: "Proseware, Inc.", role: "Front-end Developer", duration: "Sep 20XX – Aug 20XX", description: "• Develop and maintain responsive websites.\n• Collaborate with cross-functional teams." }
    ],
    education: [{ institution: "Glennwood University", degree: "BS Computer Science", duration: "20XX", details: "GPA: 3.8" }],
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js"],
    projects: [],
    certificates: []
};

const professionalData = {
  name: "Madhu Sudhan",
  title: "Aspiring Full Stack Developer",
  email: "mdhusdhndegree@gmail.com",
  phone: "86883 81084",
  linkedin: "linkedin.com/in/yourprofile",
  github: "github.com/yourprofile",
  location: "Nandyal, India",
  summary: "Aspiring full stack developer with internship experience in React.js, Python, and Django. Skilled in building scalable, user-focused web applications.",
  experience: [
    { company: "Internzlearn", role: "Web Development Intern", duration: "Feb 2025 - Mar 2025", description: "• Built responsive, user-friendly web interfaces and enhanced cross-device usability." },
    { company: "DataPro", role: "Full Stack Python Intern", duration: "Dec 2024 - Mar 2025", description: "• Developed and integrated APIs, optimized backend logic, and supported deployment." }
  ],
  education: [{ institution: "Rayalaseema University", degree: "BCA", duration: "Sep 2022 - Apr 2025", details: "GPA: 8.2/10.0" }],
  skills: ["React.js", "JavaScript", "Python", "Django", "MySQL", "Git"],
  projects: [
      { name: "Classic Snake Game", description: "• Developed a mobile and browser-compatible Snake game with real-time movement." },
      { name: "Gemini AI ChatBot", description: "• Cloned an AI chatbot using the Gemini API, replicating its conversational abilities." },
  ],
  certificates: [
      { name: "Intro to Front-End Development, Coursera" },
      { name: "The Ultimate MySQL Bootcamp, Udemy" },
  ]
};

const templates = [
  { id: 1, name: "Stalwart", data: stalwartData },
  { id: 2, name: "ATS Classic", data: atsClassicData },
  { id: 3, name: "Modern", data: modernData },
  { id: 4, name: "Classic", data: classicData },
  { id: 5, name: "Professional", data: professionalData },
];

const ResumeBuilder = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [resumeData, setResumeData] = useState(templates[0].data);
  const [resumeId, setResumeId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [zoomLevel, setZoomLevel] = useState(0.8); // Start slightly zoomed out to see full page
  const [generatingField, setGeneratingField] = useState(null);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const newTemplateData = templates.find(t => t.id === templateId)?.data;
    if (newTemplateData && !resumeId) {
      setResumeData(newTemplateData);
    }
  };
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      if (currentUser) {
        const idFromUrl = searchParams.get("id");
        if (idFromUrl) {
          setResumeId(idFromUrl);
          const ref = doc(db, "users", currentUser.uid, "resumes", idFromUrl);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            const baseData = templates.find(t => t.id === data.selectedTemplate)?.data || templates[0].data;
            setResumeData({ ...baseData, ...data });
            if (data.selectedTemplate) setSelectedTemplate(data.selectedTemplate);
          } else { 
            alert("Resume not found."); 
            searchParams.delete("id");
            setSearchParams(searchParams);
          }
        }
      }
    });
    return () => unsub();
  }, [searchParams, setSearchParams]);

  const handleDownloadResume = () => {
    const resumeContent = document.getElementById("resume-preview-content");
    if (!resumeContent) return alert("Resume content not found");
    const opt = {
      margin: 0,
      filename: `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(resumeContent).set(opt).save();
  };

  const handleInputChange = (e, section = null, idx = null) => {
    const { name, value } = e.target;
    if (section) {
      const arr = [...resumeData[section]];
      arr[idx] = { ...arr[idx], [name]: value };
      setResumeData({ ...resumeData, [section]: arr });
    } else {
      setResumeData({ ...resumeData, [name]: value });
    }
  };

  const addSectionItem = (section) => {
    let newItem = {};
    if (section === "experience") newItem = { company: "", role: "", duration: "", description: "" };
    else if (section === "education") newItem = { institution: "", degree: "", duration: "", details: "" };
    else if (section === "projects") newItem = { name: "", description: "" };
    else if (section === "certificates") newItem = { name: "" };
    setResumeData({ ...resumeData, [section]: [...(resumeData[section] || []), newItem] });
  };

  const removeSectionItem = (section, idx) => {
    const arr = [...resumeData[section]];
    arr.splice(idx, 1);
    setResumeData({ ...resumeData, [section]: arr });
  };

  const saveResumeToFirestore = async () => {
    if (!user) return alert("Log in to save.");
    try {
      const dataToSave = { ...resumeData, userId: user.uid, selectedTemplate, updatedAt: new Date() };
      const collectionPath = collection(db, "users", user.uid, "resumes");
      if (resumeId) {
        await updateDoc(doc(collectionPath, resumeId), dataToSave);
        alert("System: Resume data synchronized.");
      } else {
        const docRef = await addDoc(collectionPath, { ...dataToSave, createdAt: new Date() });
        setResumeId(docRef.id);
        searchParams.set("id", docRef.id);
        setSearchParams(searchParams);
        alert("System: New resume initialized and saved.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // --- AI Generation Handlers ---

  const handleAISummary = async () => {
    if (!resumeData.title) return alert("System Error: Job Title required for AI generation.");
    setGeneratingField('summary');
    const text = await generateResumeContent('summary', { 
        title: resumeData.title, 
        location: resumeData.location 
    });
    if (text) setResumeData({ ...resumeData, summary: text });
    setGeneratingField(null);
  };

  const handleAIExperience = async (index) => {
    const exp = resumeData.experience[index];
    if (!exp.role || !exp.company) return alert("System Error: Role and Company required.");
    setGeneratingField(`exp-${index}`);
    
    const text = await generateResumeContent('experience', { 
        role: exp.role, 
        company: exp.company 
    });
    
    if (text) {
        const newExp = [...resumeData.experience];
        newExp[index] = { ...newExp[index], description: text };
        setResumeData({ ...resumeData, experience: newExp });
    }
    setGeneratingField(null);
  };

  const handleAIProject = async (index) => {
    const proj = resumeData.projects[index];
    if (!proj.name) return alert("System Error: Project Name required.");
    setGeneratingField(`proj-${index}`);
    
    const text = await generateResumeContent('project', { 
        name: proj.name, 
        skills: resumeData.skills?.join(", ") 
    });
    
    if (text) {
        const newProj = [...resumeData.projects];
        newProj[index] = { ...newProj[index], description: text };
        setResumeData({ ...resumeData, projects: newProj });
    }
    setGeneratingField(null);
  };

  const handleAISkills = async () => {
      if (!resumeData.title) return alert("System Error: Job Title required.");
      setGeneratingField('skills');
      const text = await generateResumeContent('skills', { title: resumeData.title });
      if (text) {
          setResumeData({ ...resumeData, skills: text.split(',').map(s => s.trim()) });
      }
      setGeneratingField(null);
  };

  if (isLoading) return <div className="loading-container">System initializing...</div>;
  if (!user) {
    return (
      <div className="login-prompt">
        <h2>Authentication Required</h2>
        <p style={{marginBottom: '20px', color: '#a1a1aa'}}>Access the Resume Workspace</p>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="auth-button">
          Initialize Session (Google)
        </button>
      </div>
    );
  }

  const renderTemplate = () => {
    return (
      <div id="resume-preview-content">
        {(() => {
          switch (selectedTemplate) {
            case 1: return <TemplateStalwart data={resumeData} />;
            case 2: return <TemplateATSClassic data={resumeData} />;
            case 3: return <TemplateModern data={resumeData} />;
            case 4: return <TemplateClassic data={resumeData} />;
            case 5: return <TemplateProfessional data={resumeData} />;
            default: return <TemplateStalwart data={resumeData} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="resume-builder-container">
      {/* SIDEBAR: The "Editor" */}
      <aside className="rb-sidebar">
        <header className="rb-header">
          <h2>CodeAstra Builder</h2>
          <button onClick={() => auth.signOut()} className="auth-button">
             <FaSignOutAlt />
          </button>
        </header>
        
        <section className="template-selector">
          <h3>Select Architecture</h3>
          <div className="template-list">
            {templates.map((t) => (
              <div 
                key={t.id} 
                className={`template-thumb ${selectedTemplate === t.id ? "active" : ""}`} 
                onClick={() => handleTemplateChange(t.id)}
              >
                {t.name}
              </div>
            ))}
          </div>
        </section>

        <section className="rb-form">
          <h3>// Personal Information</h3>
          <div className="form-group">
            <input name="name" value={resumeData.name || ''} onChange={handleInputChange} placeholder="Full Name" />
            <input name="title" value={resumeData.title || ''} onChange={handleInputChange} placeholder="Target Role (e.g. Full Stack Developer)" />
            <input name="email" value={resumeData.email || ''} onChange={handleInputChange} placeholder="Email" />
            <input name="phone" value={resumeData.phone || ''} onChange={handleInputChange} placeholder="Phone" />
            <input name="location" value={resumeData.location || ''} onChange={handleInputChange} placeholder="Location" />
            <div style={{display:'flex', gap:'10px'}}>
              <input name="linkedin" value={resumeData.linkedin || ''} onChange={handleInputChange} placeholder="LinkedIn URL" />
              <input name="github" value={resumeData.github || ''} onChange={handleInputChange} placeholder="GitHub URL" />
            </div>
          </div>

          <h3>// Executive Summary</h3>
          <div className="form-group">
            <textarea name="summary" value={resumeData.summary || ''} onChange={handleInputChange} placeholder="Professional summary..." rows={4} />
            <button 
              className="ai-generate-btn" 
              onClick={handleAISummary}
              disabled={generatingField === 'summary'}
            >
              <FaMagic /> {generatingField === 'summary' ? 'Processing...' : 'Auto-Generate Summary'}
            </button>
          </div>
          
          <h3>// Experience</h3>
          <div className="form-section">
            {resumeData.experience && resumeData.experience.map((exp, i) => (
              <div key={i} className="form-group">
                <input name="role" value={exp.role} onChange={(e) => handleInputChange(e, "experience", i)} placeholder="Job Title" />
                <input name="company" value={exp.company} onChange={(e) => handleInputChange(e, "experience", i)} placeholder="Company" />
                <input name="duration" value={exp.duration} onChange={(e) => handleInputChange(e, "experience", i)} placeholder="Duration (e.g., Jan 2024 - Present)" />
                <textarea name="description" value={exp.description} onChange={(e) => handleInputChange(e, "experience", i)} placeholder="Bullet points..." rows={4} />
                
                <button 
                    className="ai-generate-btn small" 
                    onClick={() => handleAIExperience(i)}
                    disabled={generatingField === `exp-${i}`}
                >
                     <FaMagic /> {generatingField === `exp-${i}` ? 'Optimizing...' : 'Enhance Description'}
                </button>

                <button onClick={() => removeSectionItem("experience", i)} className="remove-btn"><FaTrash /> Remove Entry</button>
              </div>
            ))}
            <button onClick={() => addSectionItem("experience")} className="add-btn"><FaPlus /> Add Experience</button>
          </div>
          
          <h3>// Technical Projects</h3>
          <div className="form-section">
            {resumeData.projects && resumeData.projects.map((proj, i) => (
              <div key={i} className="form-group">
                <input name="name" value={proj.name} onChange={(e) => handleInputChange(e, "projects", i)} placeholder="Project Name" />
                <textarea name="description" value={proj.description} onChange={(e) => handleInputChange(e, "projects", i)} placeholder="Project Details..." rows={3} />
                
                 <button 
                    className="ai-generate-btn small" 
                    onClick={() => handleAIProject(i)}
                    disabled={generatingField === `proj-${i}`}
                >
                     <FaMagic /> {generatingField === `proj-${i}` ? 'Generating...' : 'Describe Project'}
                </button>

                <button onClick={() => removeSectionItem("projects", i)} className="remove-btn"><FaTrash /> Remove Project</button>
              </div>
            ))}
            <button onClick={() => addSectionItem("projects")} className="add-btn"><FaPlus /> Add Project</button>
          </div>

          <h3>// Education</h3>
          <div className="form-section">
             {resumeData.education && resumeData.education.map((edu, i) => (
              <div key={i} className="form-group">
                <input name="institution" value={edu.institution} onChange={(e) => handleInputChange(e, "education", i)} placeholder="Institution / University" />
                <input name="degree" value={edu.degree} onChange={(e) => handleInputChange(e, "education", i)} placeholder="Degree" />
                <input name="duration" value={edu.duration} onChange={(e) => handleInputChange(e, "education", i)} placeholder="Year of Passing" />
                <input name="details" value={edu.details} onChange={(e) => handleInputChange(e, "education", i)} placeholder="Additional Details (GPA, Honors)" />
                <button onClick={() => removeSectionItem("education", i)} className="remove-btn"><FaTrash /> Remove Education</button>
              </div>
            ))}
            <button onClick={() => addSectionItem("education")} className="add-btn"><FaPlus /> Add Education</button>
          </div>

          <h3>// Skills Array</h3>
          <div className="form-group">
            <textarea 
                value={resumeData.skills ? resumeData.skills.join(", ") : ''} 
                onChange={(e) => setResumeData({...resumeData, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)})} 
                placeholder="React, Python, Java, etc. (Comma separated)"
                rows={3}
            />
            <button 
                className="ai-generate-btn" 
                onClick={handleAISkills}
                disabled={generatingField === 'skills'}
            >
                <FaMagic /> {generatingField === 'skills' ? 'Analyzing...' : 'Suggest Skills'}
            </button>
          </div>
          
          <h3>// Certifications</h3>
          <div className="form-section">
            {resumeData.certificates && resumeData.certificates.map((cert, i) => (
              <div key={i} className="form-group">
                <input name="name" value={cert.name} onChange={(e) => handleInputChange(e, "certificates", i)} placeholder="Certificate Name" />
                <button onClick={() => removeSectionItem("certificates", i)} className="remove-btn"><FaTrash /> Remove</button>
              </div>
            ))}
            <button onClick={() => addSectionItem("certificates")} className="add-btn"><FaPlus /> Add Certificate</button>
          </div>

          <button onClick={saveResumeToFirestore} className="save-btn">
            <FaSave style={{marginRight:'8px'}}/> Save Data
          </button>
        </section>
      </aside>

      {/* PREVIEW AREA: The "Desk" */}
      <main className="rb-preview-area">
        <div className="rb-preview-actions">
          <button onClick={handleDownloadResume} className="download-btn">
             <FaFileExport style={{marginRight:'8px'}} /> Compile & Export
          </button>
        </div>
        
        <div className="resume-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
          {renderTemplate()}
        </div>
        
        <div className="rb-zoom-controls">
          <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.4))}><FaSearchMinus /></button>
          <span>{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.5))}><FaSearchPlus /></button>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;