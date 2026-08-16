import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt, FaCode,
  FaGraduationCap, FaAward, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle,
  FaTimesCircle, FaLaptopCode, FaPaintBrush, FaMobileAlt, FaShieldAlt,
  FaSearch, FaPencilRuler, FaHammer, FaRocket
} from "react-icons/fa";
import "./PublicPortfolio.css";

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const userData = snap.data();
          setData({ name: userData.name, photoURL: userData.photoURL, authEmail: userData.authEmail || "", ...userData.portfolio });
        }
      } catch (err) {
        console.error("Error fetching portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [userId]);

  const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName("glow-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
  };

  // --- Real, functional contact form via EmailJS ---
  // The portfolio owner is always logged in when they save their portfolio
  // (see Portfolio.jsx), so we already have their verified Firebase Auth
  // email (stored as `authEmail`, separate from the editable "Email" field
  // shown publicly). The form delivers here instead of the editable field —
  // guaranteed valid, no typos, and decoupled from whatever email the
  // student chooses to display on the page.
  //
  // This still reuses the same EmailJS project as the site's main Contact
  // page. Because every visitor's portfolio needs to route mail to a
  // DIFFERENT person, the EmailJS TEMPLATE must have a "To Email" field
  // mapped to the {{to_email}} variable — check the EmailJS dashboard if
  // messages aren't arriving.
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const deliveryEmail = data.authEmail || data.contactEmail;
    if (!deliveryEmail) return;
    setSending(true);
    setSendStatus(null);
    try {
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      await emailjs.send(
        serviceID,
        templateID,
        {
          from_name: formValues.name,
          from_email: formValues.email,
          message: formValues.message,
          to_email: deliveryEmail, // the portfolio owner's verified account email, not the editable display field
          to_name: data.name,
        },
        publicKey
      );
      setSendStatus("success");
      setFormValues({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form send failed:", err);
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="pp-loader">Loading portfolio...</div>;
  if (!data) return <div className="pp-loader">This portfolio doesn't exist yet.</div>;

  const skills = data.skills || [];
  const projects = data.projects || [];
  const experiences = data.experiences || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

  return (
    <div className="pp-wrapper" onMouseMove={handleMouseMove}>
      {/* --- NAV --- */}
      <nav className="pp-nav">
        <span className="pp-nav-name">{data.name}</span>
        <div className="pp-nav-links">
          <a href="#pp-about">About</a>
          {skills.length > 0 && <a href="#pp-skills">Skills</a>}
          {experiences.length > 0 && <a href="#pp-experience">Experience</a>}
          {projects.length > 0 && <a href="#pp-projects">Projects</a>}
          {education.length > 0 && <a href="#pp-education">Education</a>}
          <a href="#pp-contact" className="pp-nav-cta">Contact</a>
        </div>
      </nav>

      {/* --- HERO with floating personality badges --- */}
      <section className="pp-hero">
        <motion.div className="pp-hero-text" initial="hidden" animate="show" variants={fadeUp}>
          <span className="pp-status-pill"><span className="pp-status-dot" /> Available for opportunities</span>
          <h1>{data.name}</h1>
          <p className="pp-tagline">{data.tagline || "Building things, one line at a time."}</p>
          {data.location && <p className="pp-location"><FaMapMarkerAlt /> {data.location}</p>}

          <div className="pp-hero-actions">
            {data.contactEmail && <a href="#pp-contact" className="pp-btn-primary">Get in Touch</a>}
            {data.github && <a href={normalizeUrl(data.github)} target="_blank" rel="noreferrer" className="pp-btn-icon"><FaGithub /></a>}
            {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noreferrer" className="pp-btn-icon"><FaLinkedin /></a>}
          </div>
        </motion.div>

        <motion.div className="pp-hero-photo-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="pp-photo-blob" />
          <img src={data.photoURL || "https://via.placeholder.com/400"} alt={data.name} className="pp-hero-photo" />

          {/* Floating badges — real data, not decoration */}
          {data.quote && (
            <motion.div className="pp-float-badge pp-float-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              {data.quote}
            </motion.div>
          )}
          <motion.div className="pp-float-badge pp-float-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            Ready to Work
          </motion.div>
          {skills.length > 0 && (
            <motion.div className="pp-float-badge pp-float-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              {skills.length} Skills · {projects.length} Projects
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* --- ABOUT (full section, not collapsed) --- */}
      <section className="pp-section" id="pp-about">
        <h2 className="pp-section-title">About Me</h2>
        {data.bio ? (
          <p className="pp-bio">{data.bio}</p>
        ) : (
          <p className="pp-bio pp-empty-note">This student hasn't added a bio yet.</p>
        )}
      </section>

      {/* --- STATS (real counts) --- */}
      <section className="pp-stats-bar">
        <div className="pp-stat"><span className="pp-stat-num">{skills.length}</span><span className="pp-stat-label">Skills</span></div>
        <div className="pp-stat"><span className="pp-stat-num">{projects.length}</span><span className="pp-stat-label">Projects</span></div>
        <div className="pp-stat"><span className="pp-stat-num">{experiences.length}</span><span className="pp-stat-label">Experience</span></div>
        <div className="pp-stat"><span className="pp-stat-num">{certifications.length}</span><span className="pp-stat-label">Certifications</span></div>
      </section>

      {/* --- SKILLS (standalone, full section) --- */}
      {skills.length > 0 && (
        <section className="pp-section" id="pp-skills">
          <h2 className="pp-section-title">Tech Stack</h2>
          <motion.div className="pp-skills-cloud" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {skills.map((s, i) => <motion.span key={i} className="pp-skill-chip" variants={fadeUp}>{s}</motion.span>)}
          </motion.div>
        </section>
      )}

      {/* --- SERVICES / WHAT I OFFER --- */}
      <section className="pp-section" id="pp-services">
        <h2 className="pp-section-title">What I Do</h2>
        <motion.div className="pp-services-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
          <motion.div className="pp-service-card glow-card" variants={fadeUp}>
            <FaLaptopCode className="pp-service-icon" />
            <h3>Web Development</h3>
            <p>Building responsive, functional web applications from front to back.</p>
          </motion.div>
          <motion.div className="pp-service-card glow-card" variants={fadeUp}>
            <FaPaintBrush className="pp-service-icon" />
            <h3>UI/UX Design</h3>
            <p>Designing clean, intuitive interfaces people actually enjoy using.</p>
          </motion.div>
          <motion.div className="pp-service-card glow-card" variants={fadeUp}>
            <FaMobileAlt className="pp-service-icon" />
            <h3>App Development</h3>
            <p>Creating cross-platform experiences that work everywhere.</p>
          </motion.div>
          <motion.div className="pp-service-card glow-card" variants={fadeUp}>
            <FaShieldAlt className="pp-service-icon" />
            <h3>Quality & Security</h3>
            <p>Writing tested, reliable code with good practices baked in.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- EXPERIENCE (standalone timeline, not accordion) --- */}
      {experiences.length > 0 && (
        <section className="pp-section" id="pp-experience">
          <h2 className="pp-section-title">Experience</h2>
          <div className="pp-timeline">
            {experiences.map((exp, i) => (
              <motion.div key={i} className="pp-timeline-item glow-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
                <div className="pp-timeline-dot" />
                <div className="pp-timeline-content">
                  <div className="pp-timeline-head">
                    <h3>{exp.title}{exp.company ? <span className="pp-at"> · {exp.company}</span> : ""}</h3>
                    <span className="pp-duration">{exp.duration}</span>
                  </div>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- PROCESS / HOW I WORK --- */}
      <section className="pp-section" id="pp-process">
        <h2 className="pp-section-title">How I Work</h2>
        <div className="pp-process-grid">
          <div className="pp-process-step">
            <div className="pp-process-num"><FaSearch /></div>
            <h3>Discover</h3>
            <p>Understand the problem before writing a single line of code.</p>
          </div>
          <div className="pp-process-step">
            <div className="pp-process-num"><FaPencilRuler /></div>
            <h3>Design</h3>
            <p>Plan the structure, flow, and interface before building.</p>
          </div>
          <div className="pp-process-step">
            <div className="pp-process-num"><FaHammer /></div>
            <h3>Build</h3>
            <p>Write clean, maintainable code with real attention to detail.</p>
          </div>
          <div className="pp-process-step">
            <div className="pp-process-num"><FaRocket /></div>
            <h3>Ship</h3>
            <p>Test, refine, and deliver something that actually works.</p>
          </div>
        </div>
      </section>

      {/* --- PROJECTS (with real screenshots) --- */}
      {projects.length > 0 && (
        <section className="pp-section" id="pp-projects">
          <h2 className="pp-section-title"><FaCode /> Projects</h2>
          <motion.div className="pp-projects-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            {projects.map((proj, i) => (
              <motion.div key={i} className="pp-project-card glow-card" variants={fadeUp}>
                <div className="pp-project-thumb">
                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} />
                  ) : (
                    <div className="pp-project-thumb-placeholder"><FaCode /></div>
                  )}
                </div>
                <div className="pp-project-body">
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="pp-project-tags">
                      {proj.tags.map((tag, ti) => <span key={ti} className="pp-project-tag">{tag}</span>)}
                    </div>
                  )}
                  {proj.link && (
                    <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="pp-project-demo">
                      Live Demo <FaExternalLinkAlt size={11} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* --- EDUCATION TIMELINE --- */}
      {education.length > 0 && (
        <section className="pp-section" id="pp-education">
          <h2 className="pp-section-title"><FaGraduationCap /> Education</h2>
          <div className="pp-edu-timeline">
            {education.map((edu, i) => (
              <motion.div key={i} className="pp-edu-item" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
                <div className="pp-edu-year">{edu.duration}</div>
                <div className="pp-edu-line" />
                <div className="pp-edu-card">
                  <FaGraduationCap className="pp-edu-icon" />
                  <div>
                    <h3>{edu.degree}</h3>
                    <p className="pp-edu-institution">{edu.institution}</p>
                    {edu.details && <p className="pp-edu-details">{edu.details}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- CERTIFICATIONS (standalone cards) --- */}
      {certifications.length > 0 && (
        <section className="pp-section" id="pp-certifications">
          <h2 className="pp-section-title"><FaAward /> Certifications</h2>
          <motion.div className="pp-certs-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            {certifications.map((c, i) => (
              <motion.div key={i} className="pp-cert-card glow-card" variants={fadeUp}>
                <FaAward className="pp-cert-card-icon" />
                <div>
                  <h3>{c.name}</h3>
                  {c.issuer && <p>{c.issuer}</p>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* --- CONTACT (real functional form) --- */}
      <section className="pp-section pp-contact-section" id="pp-contact">
        <div className="pp-contact-left">
          <h2 className="pp-section-title">Let's Connect</h2>
          <p>Open to internships, entry-level roles, and collaboration. Reach out directly or send a message.</p>
          <div className="pp-contact-details">
            {data.contactEmail && <div><FaEnvelope /> {data.contactEmail}</div>}
            {data.location && <div><FaMapMarkerAlt /> {data.location}</div>}
          </div>
          <div className="pp-hero-actions">
            {data.github && <a href={normalizeUrl(data.github)} target="_blank" rel="noreferrer" className="pp-btn-icon"><FaGithub /></a>}
            {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noreferrer" className="pp-btn-icon"><FaLinkedin /></a>}
          </div>
        </div>

        <form className="pp-contact-form" onSubmit={handleContactSubmit}>
          <label>Your Name</label>
          <input required value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} />
          <label>Your Email</label>
          <input required type="email" value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
          <label>Message</label>
          <textarea required rows="4" value={formValues.message} onChange={(e) => setFormValues({ ...formValues, message: e.target.value })} />
          <button type="submit" className="pp-btn-primary pp-form-submit" disabled={sending}>
            {sending ? "Sending..." : <>Send Message <FaPaperPlane size={13} /></>}
          </button>
          {sendStatus === "success" && <p className="pp-form-status success"><FaCheckCircle /> Message sent!</p>}
          {sendStatus === "error" && <p className="pp-form-status error"><FaTimesCircle /> Couldn't send — try emailing directly.</p>}
        </form>
      </section>

      {/* --- FOOTER with embedded map --- */}
      <footer className="pp-footer">
        {data.location && (
          <iframe
            title="location-map"
            className="pp-map"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}&output=embed`}
          />
        )}
        <div className="pp-footer-content">
          <div className="pp-footer-col">
            <h4>Contact</h4>
            {data.contactEmail && <p>{data.contactEmail}</p>}
            {data.location && <p>{data.location}</p>}
          </div>
          <div className="pp-footer-col">
            <h4>Follow</h4>
            <div className="pp-footer-socials">
              {data.github && <a href={normalizeUrl(data.github)} target="_blank" rel="noreferrer"><FaGithub /></a>}
              {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noreferrer"><FaLinkedin /></a>}
            </div>
          </div>
        </div>
        <p className="pp-copyright">© {new Date().getFullYear()} {data.name} · Built with CodeAstra</p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;