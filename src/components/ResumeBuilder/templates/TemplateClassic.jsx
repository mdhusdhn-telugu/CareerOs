import React from 'react';

const TemplateClassic = ({ data }) => {
  return (
    <div id="resume-preview-content" className="resume-preview template-4">
      <header className="resume-header">
        <h1>{data.name}</h1>
        <p className="resume-title">{data.title}</p>
        <div className="contact-info">
          <span>{data.phone}</span>
          <span>{data.location}</span>
          <span>{data.email}</span>
          <span>{data.linkedin}</span>
        </div>
      </header>

      <div className="resume-body">
        <div className="left-column">
          <h2 className="section-title">Objective</h2>
          <h2 className="section-title">Skills & Abilities</h2>
          <h2 className="section-title">Experience</h2>
          <h2 className="section-title">Education</h2>
          <h2 className="section-title">Communication</h2>
          <h2 className="section-title">Leadership</h2>
        </div>

        <div className="right-column">
          <section className="resume-section">
            <p>{data.summary}</p>
          </section>

          <section className="resume-section">
            <ul className="skills-list">
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>

          <section className="resume-section">
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

          <section className="resume-section">
            {data.education.map((edu, i) => (
              <div key={i} className="school">
                <h3>{edu.institution}</h3>
                <h4>{edu.degree}</h4>
                <span>{edu.duration}</span>
                <p>{edu.details}</p>
              </div>
            ))}
          </section>
          
          <section className="resume-section">
            {/* These would need new fields in your form, for now using placeholders */}
            <p>{data.communication || "Excellent communication skills enable me to collaborate with clients, stakeholders, and cross-functional teams to deliver high-quality results."}</p>
          </section>

          <section className="resume-section">
            <p>{data.leadership || "Mentor junior developers, coordinate project tasks, and implement best practices to ensure timely delivery of high-quality web applications."}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplateClassic;