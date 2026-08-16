import React from 'react';
import './TemplateModern.css';

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const TemplateModern = ({ data }) => {
  return (
    <div id="resume-preview-content" className="resume-preview template-3">
      {/* Main content comes first in the DOM (for ATS reading order),
          then is visually placed on the right via CSS row-reverse. */}
      <div className="mod-main">
        <header className="resume-header">
          <h1>{data.name}</h1>
          {data.title && <p className="resume-title">{data.title}</p>}
        </header>

        {data.summary && (
          <section className="resume-section profile-section">
            <h2 className="section-title">Profile</h2>
            <p>{data.summary}</p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="resume-section experience-section">
            <h2 className="section-title">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="job">
                <div className="job-header">
                  <h3>{exp.role}{exp.company ? ` • ${exp.company}` : ''}</h3>
                  <span>{exp.duration}</span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="resume-section experience-section">
            <h2 className="section-title">Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="job">
                <div className="job-header">
                  <h3>{proj.name}</h3>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{proj.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <aside className="mod-sidebar">
        {(data.location || data.phone || data.email || data.linkedin || data.github) && (
          <section className="resume-section contact-section">
            <h2 className="section-title">Contact</h2>
            {data.location && (
              <div className="contact-item"><strong>Address</strong><span>{data.location}</span></div>
            )}
            {data.phone && (
              <div className="contact-item"><strong>Phone</strong><span>{data.phone}</span></div>
            )}
            {data.email && (
              <div className="contact-item"><strong>Email</strong><span><a href={`mailto:${data.email}`}>{data.email}</a></span></div>
            )}
            {data.linkedin && (
              <div className="contact-item"><strong>LinkedIn</strong><span><a href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">{data.linkedin.replace(/^https?:\/\//, '')}</a></span></div>
            )}
            {data.github && (
              <div className="contact-item"><strong>GitHub</strong><span><a href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer">{data.github.replace(/^https?:\/\//, '')}</a></span></div>
            )}
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section className="resume-section skills-section">
            <h2 className="section-title">Key Skills</h2>
            <ul className="skills-list">
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {data.languages && data.languages.length > 0 && (
          <section className="resume-section skills-section languages-section">
            <h2 className="section-title">Languages</h2>
            <ul className="skills-list">
              {data.languages.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section className="resume-section education-section">
            <h2 className="section-title">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="school">
                <h3>{edu.degree}</h3>
                <h4>{edu.institution}</h4>
                <span>{edu.duration}</span>
                {edu.details && <p>{edu.details}</p>}
              </div>
            ))}
          </section>
        )}

        {data.certificates && data.certificates.length > 0 && (
          <section className="resume-section skills-section">
            <h2 className="section-title">Certifications</h2>
            <ul className="skills-list">
              {data.certificates.map((cert, i) => (
                <li key={i}>{cert.name}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
};

export default TemplateModern;