import React from 'react';
import './TemplateStalwart.css';

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const TemplateStalwart = ({ data }) => {
  // Helper to split descriptions into bullet points
  const renderDescription = (text = '') => {
    return text
      .split('\n')
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean)
      .map((line, index) => <li key={index}>{line}</li>);
  };

  return (
    <div id="resume-preview-content" className="resume-preview template-1">
      <header className="resume-header">
        <h1>{data.name}</h1>
        {data.title && <p className="resume-title">{data.title}</p>}
        <div className="contact-info">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
          {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {data.github && <a href={normalizeUrl(data.github)} target="_blank" rel="noopener noreferrer">GitHub</a>}
        </div>
      </header>

      {data.summary && (
        <section className="resume-section">
          <h2>Profile</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{data.summary}</p>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="resume-section skills">
          <h2>Core Skills</h2>
          <ul>
            {data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {data.languages && data.languages.length > 0 && (
        <section className="resume-section languages">
          <h2>Languages</h2>
          <ul>
            {data.languages.map((lang, i) => (
              <li key={i}>{lang}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="resume-section">
          <h2>Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="job">
              <div className="job-header">
                <h3>{exp.role}{exp.company ? ` | ${exp.company}` : ''}</h3>
                <span>{exp.duration}</span>
              </div>
              <ul>{renderDescription(exp.description)}</ul>
            </div>
          ))}
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="resume-section">
          <h2>Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="job">
              <div className="job-header">
                <h3>{proj.name}</h3>
              </div>
              <ul>{renderDescription(proj.description)}</ul>
            </div>
          ))}
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="resume-section">
          <h2>Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="school">
              <div className="school-header">
                <h3>{edu.degree}{edu.institution ? ` | ${edu.institution}` : ''}</h3>
                <span>{edu.duration}</span>
              </div>
              {edu.details && <p>{edu.details}</p>}
            </div>
          ))}
        </section>
      )}

      {data.certificates && data.certificates.length > 0 && (
        <section className="resume-section">
          <h2>Certifications</h2>
          {data.certificates.map((cert, i) => (
            <p key={i}>{cert.name}</p>
          ))}
        </section>
      )}

      {data.activities && (
        <section className="resume-section activities">
          <h2>Activities and Interests</h2>
          <p>{data.activities}</p>
        </section>
      )}
    </div>
  );
};

export default TemplateStalwart;