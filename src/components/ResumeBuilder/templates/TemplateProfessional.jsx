import React from 'react';

const TemplateProfessional = ({ data }) => {
  return (
    <div id="resume-preview-content" className="resume-preview template-5">
      <aside className="left-column">
        <header className="resume-header">
          <h1>{data.name}</h1>
          <p className="resume-title">{data.title}</p>
        </header>

        <section className="contact-info">
          <h3>Contact</h3>
          <p>{data.phone}</p>
          <p>{data.email}</p>
          <p>{data.location}</p>
          <p><a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
          <p><a href={data.github} target="_blank" rel="noopener noreferrer">GitHub</a></p>
        </section>

        <section className="skills-section">
          <h3>Skills</h3>
          <ul>
            {data.skills && data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>

        <section className="certificates-section">
           <h3>Certificates</h3>
           {data.certificates && data.certificates.map((cert, i) => (
             <p key={i}>{cert.name}</p>
           ))}
        </section>
      </aside>

      <main className="right-column">
        <section className="resume-section summary-section">
          <h2>Objective</h2>
          <p>{data.summary}</p>
        </section>

        <section className="resume-section experience-section">
          <h2>Internship Experience</h2>
          {data.experience && data.experience.map((exp, i) => (
            <div key={i} className="job">
              <div className="job-header">
                <h3>{exp.role}</h3>
                <span>{exp.duration}</span>
              </div>
              <h4>{exp.company}</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="resume-section projects-section">
          <h2>Personal Projects</h2>
          {data.projects && data.projects.map((proj, i) => (
            <div key={i} className="job">
              <div className="job-header">
                <h3>{proj.name}</h3>
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{proj.description}</p>
            </div>
          ))}
        </section>

        <section className="resume-section education-section">
          <h2>Education</h2>
          {data.education && data.education.map((edu, i) => (
            <div key={i} className="school">
              <div className="school-header">
                <h3>{edu.institution}</h3>
                <span>{edu.duration}</span>
              </div>
              <h4>{edu.degree}</h4>
              <p>{edu.details}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default TemplateProfessional;