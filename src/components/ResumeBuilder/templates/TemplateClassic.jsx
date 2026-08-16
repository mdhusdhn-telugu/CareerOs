import React from 'react';
import './TemplateClassic.css';

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const TemplateClassic = ({ data }) => {
  return (
    <div id="resume-preview-content" className="resume-preview template-4">
      <header className="resume-header">
        <h1>{data.name}</h1>
        {data.title && <p className="resume-title">{data.title}</p>}
        <div className="contact-info">
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
          {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {data.github && <a href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer">GitHub</a>}
        </div>
      </header>

      <div className="resume-body">
        {data.summary && (
          <section className="resume-section">
            <h2 className="section-title">Objective</h2>
            <p>{data.summary}</p>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Skills &amp; Abilities</h2>
            <ul className="skills-list">
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {data.languages && data.languages.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Languages</h2>
            <ul className="skills-list">
              {data.languages.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="job">
                <h3>{exp.company}</h3>
                <div className="job-subheader">
                  <h4>{exp.role}</h4>
                  <span>{exp.duration}</span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} className="job">
                <h3>{proj.name}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="school">
                <h3>{edu.institution}</h3>
                <h4>{edu.degree}</h4>
                <span>{edu.duration}</span>
                {edu.details && <p>{edu.details}</p>}
              </div>
            ))}
          </section>
        )}

        {data.certificates && data.certificates.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Certifications</h2>
            <ul className="skills-list">
              {data.certificates.map((cert, i) => (
                <li key={i}>{cert.name}</li>
              ))}
            </ul>
          </section>
        )}

        {(data.communication || data.leadership) && (
          <section className="resume-section">
            <h2 className="section-title">Additional Strengths</h2>
            {data.communication && <p>{data.communication}</p>}
            {data.leadership && <p>{data.leadership}</p>}
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateClassic;