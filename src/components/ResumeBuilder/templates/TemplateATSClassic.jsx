import React from 'react';
import './TemplateATSClassic.css';

const normalizeUrl = (url) => (url && !/^https?:\/\//i.test(url) ? `https://${url}` : url);

const TemplateATSClassic = ({ data }) => {
  const renderDescription = (text) => {
    return text.split('\n').map((line, index) => (
      <li key={index}>{line.replace(/^•\s*/, '')}</li>
    ));
  };

  return (
    <div id="resume-preview-content" className="resume-preview template-2">
      <header className="resume-header">
        <h1>{data.name}</h1>
        <div className="contact-info">
          <span>{data.location}</span>
          <span>{data.phone}</span>
          {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
          {data.linkedin && <a href={normalizeUrl(data.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        </div>
        <p className="summary-statement">{data.summary}</p>
      </header>

      <div className="resume-body">
        <section className="resume-section">
          <h2 className="section-title">Education</h2>
          <div className="section-content">
            {data.education.map((edu, i) => (
              <div key={i} className="school">
                <div className="school-header">
                  <h3><strong>{edu.degree}</strong>, {edu.institution}</h3>
                  <span>{edu.duration}</span>
                </div>
                <p className="details">{edu.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2 className="section-title">Experience</h2>
          <div className="section-content">
            {data.experience.map((exp, i) => (
              <div key={i} className="job">
                <div className="job-header">
                  <h3><strong>{exp.role}</strong> | {exp.company}</h3>
                  <span>{exp.duration}</span>
                </div>
                <ul>{renderDescription(exp.description)}</ul>
              </div>
            ))}
          </div>
        </section>

        {data.projects && data.projects.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Projects</h2>
            <div className="section-content">
              {data.projects.map((proj, i) => (
                <div key={i} className="job">
                  <div className="job-header">
                    <h3><strong>{proj.name}</strong></h3>
                  </div>
                  <ul>{renderDescription(proj.description)}</ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="resume-section">
          <h2 className="section-title">Skills</h2>
          <div className="section-content">
            <ul className="skills-list">
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        </section>

        {data.languages && data.languages.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Languages</h2>
            <div className="section-content">
              <ul className="skills-list">
                {data.languages.map((lang, i) => (
                  <li key={i}>{lang}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {data.certificates && data.certificates.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Certifications</h2>
            <div className="section-content">
              {data.certificates.map((cert, i) => (
                <p key={i} className="details">{cert.name}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateATSClassic;