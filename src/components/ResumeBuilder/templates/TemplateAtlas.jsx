import React from 'react';
import './TemplateAtlas.css';

// TemplateAtlas — modeled directly on a real resume format that's already
// proven to work with actual recruiters (plain black text, no chips/colors,
// dense single-page hierarchy: Role — Company with dates right-aligned,
// skills as clean comma lines by nature rather than decorative tags).
// Uses the exact same `data` shape as every other template.

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const TemplateAtlas = ({ data }) => {
  const renderBullets = (text = '') =>
    text
      .split('\n')
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean)
      .map((line, i) => <li key={i}>{line}</li>);

  const contactItems = [];
  if (data.location) contactItems.push(<span key="loc">{data.location}</span>);
  if (data.email) contactItems.push(<a key="email" href={`mailto:${data.email}`}>{data.email}</a>);
  if (data.phone) contactItems.push(<span key="phone">{data.phone}</span>);
  if (data.linkedin) contactItems.push(<a key="li" href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>);
  if (data.github) contactItems.push(<a key="gh" href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer">GitHub</a>);

  return (
    <div id="resume-preview-content" className="resume-preview template-atlas">
      <header className="atlas-header">
        <h1>{data.name}</h1>
        <div className="atlas-contact">
          {contactItems.map((item, i) => (
            <React.Fragment key={i}>
              {item}
              {i < contactItems.length - 1 && <span className="atlas-sep">|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      {data.summary && (
        <section className="atlas-section">
          <h2>Summary</h2>
          <p>{data.summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="atlas-section">
          <h2>Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="atlas-entry">
              <div className="atlas-entry-head">
                <h3>{exp.role}{exp.company ? ` — ${exp.company}` : ''}</h3>
                <span className="atlas-dates">{exp.duration}</span>
              </div>
              <ul>{renderBullets(exp.description)}</ul>
              {exp.subEntries && exp.subEntries.length > 0 && (
                <div className="atlas-subentries">
                  {exp.subEntries.map((sub, j) => (
                    <div key={j} className="atlas-subentry">
                      <h4>{sub.name}</h4>
                      <ul>{renderBullets(sub.description)}</ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="atlas-section">
          <h2>Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="atlas-entry">
              <div className="atlas-entry-head">
                <h3>{proj.name}</h3>
              </div>
              <ul>{renderBullets(proj.description)}</ul>
            </div>
          ))}
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="atlas-section">
          <h2>Skills</h2>
          <p className="atlas-plain-list">{data.skills.join(', ')}</p>
        </section>
      )}

      {data.languages && data.languages.length > 0 && (
        <section className="atlas-section">
          <h2>Languages</h2>
          <p className="atlas-plain-list">{data.languages.join(', ')}</p>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="atlas-section">
          <h2>Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="atlas-entry atlas-edu">
              <div className="atlas-entry-head">
                <h3>{edu.degree}{edu.institution ? `, ${edu.institution}` : ''}</h3>
                <span className="atlas-dates">{edu.duration}</span>
              </div>
              {edu.details && <p className="atlas-edu-details">{edu.details}</p>}
            </div>
          ))}
        </section>
      )}

      {data.certificates && data.certificates.length > 0 && (
        <section className="atlas-section">
          <h2>Certifications</h2>
          <ul className="atlas-cert-list">
            {data.certificates.map((cert, i) => (
              <li key={i}>{cert.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default TemplateAtlas;