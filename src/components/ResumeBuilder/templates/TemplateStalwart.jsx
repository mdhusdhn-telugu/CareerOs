import React from 'react';

const TemplateStalwart = ({ data }) => {
  // Helper to split descriptions into bullet points
  const renderDescription = (text) => {
    return text.split('\n').map((line, index) => (
      <li key={index}>{line.replace(/^•\s*/, '')}</li>
    ));
  };

  return (
    <div id="resume-preview-content" className="resume-preview template-1">
      <header className="resume-header">
        <h1>{data.name}</h1>
        <div className="contact-info">
          <span>{data.location}</span>
          <span>{data.phone}</span>
          <span>{data.email}</span>
          <span>{data.linkedin}</span>
        </div>
      </header>

      <section className="resume-section">
        <h2>Profile</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{data.summary}</p>
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="job">
            <div className="job-header">
              <h3><strong>{exp.role}</strong> | {exp.company}</h3>
              <span>{exp.duration}</span>
            </div>
            <ul>{renderDescription(exp.description)}</ul>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="school">
             <div className="school-header">
                <h3><strong>{edu.degree}</strong> | {edu.institution}</h3>
                <span>{edu.duration}</span>
             </div>
             <p>{edu.details}</p>
          </div>
        ))}
      </section>

      <section className="resume-section skills">
        <h2>Skills & Abilities</h2>
        <ul>
          {data.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="resume-section activities">
        <h2>Activities and Interests</h2>
        {/* Assuming activities are a comma-separated string in summary or a new field */}
        <p>{data.activities || 'Theater, environmental conservation, art, hiking, skiing, travel'}</p>
      </section>
    </div>
  );
};

export default TemplateStalwart;