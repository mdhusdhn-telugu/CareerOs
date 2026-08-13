import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaChevronDown, 
  FaExternalLinkAlt, FaCode, FaBriefcase, FaGraduationCap, FaAward 
} from "react-icons/fa";
import Scene from "../Homepage/Scene"; 
import "./PublicPortfolio.css"; 

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for hero text
  const yRange = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const userData = snap.data();
          setData({
            name: userData.name,
            photoURL: userData.photoURL,
            education: userData.education,
            ...userData.portfolio
          });
        }
      } catch (err) {
        console.error("Error fetching portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [userId]);

  if (loading) return <div className="loader-screen">INITIALIZING EXPERIENCE...</div>;
  if (!data) return <div className="loader-screen">USER DATA NOT FOUND</div>;

  // Animation Configs
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="cinema-wrapper">
      {/* Background Starfield - Persistent */}
      <div className="fixed-bg">
        <Scene />
        <div className="overlay-gradient"></div>
      </div>

      {/* --- SECTION 1: MASSIVE HERO --- */}
      <section className="hero-section-cinema">
        <motion.div 
          className="hero-content-cinema"
          style={{ y: yRange, opacity: opacityRange }}
        >
          <div className="hero-badge">Available for Work</div>
          <h1 className="hero-name-giant">{data.name}</h1>
          <p className="hero-tagline-cinema">{data.tagline || "Creative Developer & Engineer"}</p>
          
          <div className="hero-socials-row">
            {data.github && <a href={data.github} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>}
            {data.contactEmail && <a href={`mailto:${data.contactEmail}`}><FaEnvelope /></a>}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <p>Scroll to Explore</p>
          <FaChevronDown />
        </motion.div>
      </section>

      {/* --- SECTION 2: IDENTITY (Split Screen) --- */}
      <section className="content-section-cinema">
        <div className="container-cinema split-layout">
          <motion.div 
            className="image-container-tilt"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="glow-backdrop"></div>
            <img src={data.photoURL} alt={data.name} className="profile-img-cinema" />
          </motion.div>
          
          <motion.div 
            className="bio-text-cinema"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-heading">About The Developer</h2>
            <p>{data.bio || "No bio available yet."}</p>
            
            <div className="tech-stack-row">
              {data.skills?.map((skill, i) => (
                <span key={i} className="tech-pill">{skill}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: PROJECTS (Horizontal Scroll Feel) --- */}
      {data.projects?.length > 0 && (
        <section className="content-section-cinema dark-bg">
          <div className="container-cinema">
            <motion.h2 
              className="section-heading center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Selected Works
            </motion.h2>

            <motion.div 
              className="projects-grid-cinema"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {data.projects.map((proj, i) => (
                <motion.div key={i} variants={fadeInUp} className="project-card-cinema">
                  <div className="card-shine"></div>
                  <div className="project-top">
                    <FaCode className="project-icon-large" />
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="link-btn"><FaExternalLinkAlt /></a>}
                  </div>
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* --- SECTION 4: EXPERIENCE (Timeline) --- */}
      {data.experiences?.length > 0 && (
        <section className="content-section-cinema">
          <div className="container-cinema">
            <motion.h2 
              className="section-heading center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              Career Trajectory
            </motion.h2>

            <div className="timeline-cinema">
              <div className="timeline-line"></div>
              {data.experiences.map((exp, i) => (
                <motion.div 
                  key={i} 
                  className="timeline-block"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="timeline-dot-cinema"></div>
                  <div className="timeline-content-cinema">
                    <h3>{exp.title}</h3>
                    <h4>{exp.company}</h4>
                    <span className="time-badge">{exp.startDate} - {exp.endDate}</span>
                    <p>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- SECTION 5: EDUCATION & CERTIFICATIONS (Grid) --- */}
      <section className="content-section-cinema dark-bg">
        <div className="container-cinema grid-2-equal">
          {/* Education */}
          <motion.div 
            className="info-box-cinema"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="sub-heading"><FaGraduationCap /> Education</h3>
            <div className="info-content">
              <p className="highlight-text">{data.education || "Education details not provided."}</p>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div 
            className="info-box-cinema"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="sub-heading"><FaAward /> Certifications</h3>
            <div className="certs-stack">
              {data.certifications?.length > 0 ? (
                data.certifications.map((cert, i) => (
                  <div key={i} className="cert-row">
                    <span>{cert.name}</span>
                    <span className="issuer-tag">{cert.issuer}</span>
                  </div>
                ))
              ) : <p className="muted-text">No certifications listed.</p>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cinema-footer">
        <p>© {new Date().getFullYear()} {data.name}. Designed with CodeAstra.</p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;