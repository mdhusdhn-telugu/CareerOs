import React from 'react';
import './TemplateExecutive.css';

// TemplateExecutive — a dense, single-page-first, ATS-safe design.
// Uses the EXACT SAME `data` shape as the other 5 templates
// (name, title, phone, location, email, linkedin, github, summary,
// skills[], experience[]{role,company,duration,description},
// education[]{degree,institution,duration,details},
// projects[]{name,description}, certificates[]{name})
// — so it's a drop-in alternative, no changes needed elsewhere.

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const TemplateExecutive = ({ data }) => {
  const renderBullets = (text = '') =>
    text
      .split('\n')
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean)
      .map((line, i) => <li key={i}>{line}</li>);

  return (
    <div id="resume-preview-content" className="resume-preview template-executive">
      <header className="ex-header">
        <div className="ex-heading">
          <h1>{data.name}</h1>
          {data.title && <p className="ex-title">{data.title}</p>}
        </div>
        <div className="ex-contact">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
          {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {data.github && <a href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer">GitHub</a>}
        </div>
      </header>

      {data.summary && (
        <section className="ex-section ex-summary">
          <p>{data.summary}</p>
        </section>
      )}

      <div className="ex-body">
        <main className="ex-main">
          {data.experience && data.experience.length > 0 && (
            <section className="ex-section">
              <h2 className="ex-label">Experience</h2>
              {data.experience.map((exp, i) => (
                <div key={i} className="ex-entry">
                  <div className="ex-entry-head">
                    <h3>{exp.role}{exp.company ? <span className="ex-at"> — {exp.company}</span> : ''}</h3>
                    <span className="ex-duration">{exp.duration}</span>
                  </div>
                  <ul>{renderBullets(exp.description)}</ul>
                </div>
              ))}
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section className="ex-section">
              <h2 className="ex-label">Projects</h2>
              {data.projects.map((proj, i) => (
                <div key={i} className="ex-entry">
                  <div className="ex-entry-head">
                    <h3>{proj.name}</h3>
                  </div>
                  <ul>{renderBullets(proj.description)}</ul>
                </div>
              ))}
            </section>
          )}
        </main>

        <aside className="ex-sidebar">
          {data.skills && data.skills.length > 0 && (
            <section className="ex-section">
              <h2 className="ex-label">Skills</h2>
              <div className="ex-skill-cloud">
                {data.skills.map((skill, i) => (
                  <span key={i} className="ex-skill-chip">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {data.languages && data.languages.length > 0 && (
            <section className="ex-section">
              <h2 className="ex-label">Languages</h2>
              <div className="ex-skill-cloud">
                {data.languages.map((lang, i) => (
                  <span key={i} className="ex-skill-chip">{lang}</span>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section className="ex-section">
              <h2 className="ex-label">Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} className="ex-edu-entry">
                  <h3>{edu.degree}</h3>
                  <p className="ex-institution">{edu.institution}</p>
                  <span className="ex-duration">{edu.duration}</span>
                  {edu.details && <p className="ex-edu-details">{edu.details}</p>}
                </div>
              ))}
            </section>
          )}

          {data.certificates && data.certificates.length > 0 && (
            <section className="ex-section">
              <h2 className="ex-label">Certifications</h2>
              <ul className="ex-cert-list">
                {data.certificates.map((cert, i) => (
                  <li key={i}>{cert.name}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default TemplateExecutive;