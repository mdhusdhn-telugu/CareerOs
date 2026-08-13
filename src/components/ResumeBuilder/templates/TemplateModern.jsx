import React from 'react';

const TemplateModern = ({ data }) => {
  return (
    <div id="resume-preview-content" className="resume-preview template-3">
      <div className="left-column">
        <h2 className="section-title">Profile</h2>
        <h2 className="section-title">Key Skills</h2>
        <h2 className="section-title">Contact</h2>
        <h2 className="section-title">Education</h2>
        <h2 className="section-title">Experience</h2>
      </div>
      <div className="right-column">
        <header className="resume-header">
          <h1>{data.name}</h1>
          <p className="resume-title">{data.title}</p>
        </header>

        <section className="resume-section profile-section">
          <p>{data.summary}</p>
        </section>

        <section className="resume-section skills-section">
          <ul className="skills-list">
            {data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>

        <section className="resume-section contact-section">
          <div className="contact-item">
            <strong>Address</strong>
            <span>{data.location}</span>
          </div>
          <div className="contact-item">
            <strong>Phone</strong>
            <span>{data.phone}</span>
          </div>
          <div className="contact-item">
            <strong>Email</strong>
            <span>{data.email}</span>
          </div>
          <div className="contact-item">
            <strong>Website</strong>
            <span>{data.linkedin}</span>
          </div>
        </section>

        <section className="resume-section education-section">
          {data.education.map((edu, i) => (
            <div key={i} className="school">
              <h3>{edu.degree}</h3>
              <h4>{edu.institution}</h4>
              <span>{edu.duration}</span>
              <p>{edu.details}</p>
            </div>
          ))}
        </section>

        <section className="resume-section experience-section">
          {data.experience.map((exp, i) => (
            <div key={i} className="job">
              <div className="job-header">
                <h3>{exp.role} • {exp.company}</h3>
                <span>{exp.duration}</span>
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default TemplateModern;