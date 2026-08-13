import React from 'react';

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
          <span>{data.email}</span>
          <span>{data.linkedin}</span>
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
      </div>
    </div>
  );
};

export default TemplateATSClassic;