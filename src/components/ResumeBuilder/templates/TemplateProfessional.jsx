import React from 'react';
import './TemplateProfessional.css';

const TemplateProfessional = ({ data }) => {
  return (
    <div id="resume-preview-content" className="resume-preview template-5">
      {/* Main content comes first in the DOM (for ATS reading order),
          then is visually placed on the right via CSS row-reverse. */}
      <main className="right-column">
        {data.summary && (
          <section className="resume-section summary-section">
            <h2>Objective</h2>
            <p>{data.summary}</p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="resume-section experience-section">
            <h2>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="job">
                <div className="job-header">
                  <h3>{exp.role}</h3>
                  <span>{exp.duration}</span>
                </div>
                {exp.company && <h4>{exp.company}</h4>}
                <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section className="resume-section projects-section">
            <h2>Projects</h2>
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

        {data.education && data.education.length > 0 && (
          <section className="resume-section education-section">
            <h2>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="school">
                <div className="school-header">
                  <h3>{edu.institution}</h3>
                  <span>{edu.duration}</span>
                </div>
                <h4>{edu.degree}</h4>
                {edu.details && <p>{edu.details}</p>}
              </div>
            ))}
          </section>
        )}
      </main>

      <aside className="left-column">
        <header className="resume-header">
          <h1>{data.name}</h1>
          {data.title && <p className="resume-title">{data.title}</p>}
        </header>

        <section className="contact-info">
          <h3>Contact</h3>
          {data.phone && <p>{data.phone}</p>}
          {data.email && <p><a href={`mailto:${data.email}`}>{data.email}</a></p>}
          {data.location && <p>{data.location}</p>}
          {data.linkedin && (
            <p>
              <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </p>
          )}
          {data.github && (
            <p>
              <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
          )}
        </section>

        {data.skills && data.skills.length > 0 && (
          <section className="skills-section">
            <h3>Skills</h3>
            <ul>
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {data.languages && data.languages.length > 0 && (
          <section className="skills-section languages-section">
            <h3>Languages</h3>
            <ul>
              {data.languages.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </section>
        )}

        {data.certificates && data.certificates.length > 0 && (
          <section className="certificates-section">
            <h3>Certificates</h3>
            {data.certificates.map((cert, i) => (
              <p key={i}>{cert.name}</p>
            ))}
          </section>
        )}
      </aside>
    </div>
  );
};

export default TemplateProfessional;