// src/utils/profileResumeSync.js
//
// Bidirectional data bridge between Portfolio (users/{uid}.portfolio) and
// Resume data (the shape shared by all resume templates). Fields unique to
// one side (e.g. resume's phone/location, or portfolio's photoURL) are left
// alone rather than guessed at.
//
// Portfolio's experience/education/certifications intentionally mirror the
// resume's own shapes ({title/company/duration/description}, etc.) so
// mapping between them doesn't require fragile date-parsing or guessing —
// the same entry works in both places with only field-name differences.

/**
 * Turns Portfolio data into a resume-ready `data` object.
 * @param {object} userDoc - the raw users/{uid} Firestore doc (has .name and .portfolio)
 */
export function mapPortfolioToResume(userDoc = {}) {
  const portfolio = userDoc.portfolio || {};

  return {
    name: userDoc.name || "",
    title: portfolio.tagline || "",
    summary: portfolio.bio || "",
    email: portfolio.contactEmail || "",
    linkedin: portfolio.linkedin || "",
    github: portfolio.github || "",
    skills: portfolio.skills || [],
    projects: (portfolio.projects || []).map((p) => ({
      name: p.title,
      description: p.description,
    })),
    experience: (portfolio.experiences || []).map((e) => ({
      role: e.title,
      company: e.company,
      duration: e.duration,
      description: e.description,
    })),
    education: (portfolio.education || []).map((e) => ({
      degree: e.degree,
      institution: e.institution,
      duration: e.duration,
      details: e.details,
    })),
    certificates: (portfolio.certifications || []).map((c) => ({
      name: c.issuer ? `${c.name} — ${c.issuer}` : c.name,
    })),
  };
}

/**
 * Turns Resume data into a portfolio-ready partial update.
 * @param {object} resumeData - the resume `data` object (same shape templates consume)
 */
export function mapResumeToPortfolio(resumeData = {}) {
  return {
    name: resumeData.name || "",
    tagline: resumeData.title || "",
    bio: resumeData.summary || "",
    contactEmail: resumeData.email || "",
    linkedin: resumeData.linkedin || "",
    github: resumeData.github || "",
    skills: resumeData.skills || [],
    projects: (resumeData.projects || []).map((p) => ({
      title: p.name,
      description: p.description,
      link: "",
    })),
    experiences: (resumeData.experience || []).map((e) => ({
      title: e.role,
      company: e.company,
      duration: e.duration,
      description: e.description,
    })),
    education: (resumeData.education || []).map((e) => ({
      degree: e.degree,
      institution: e.institution,
      duration: e.duration,
      details: e.details,
    })),
    certifications: (resumeData.certificates || []).map((c) => ({
      name: c.name,
      issuer: "",
    })),
  };
}

/** True if the portfolio has enough content that auto-importing INTO it would be destructive. */
export function hasMeaningfulPortfolioData(portfolio = {}) {
  return Boolean(
    portfolio.tagline ||
    portfolio.bio ||
    (portfolio.skills && portfolio.skills.length > 0) ||
    (portfolio.projects && portfolio.projects.length > 0) ||
    (portfolio.experiences && portfolio.experiences.length > 0) ||
    (portfolio.education && portfolio.education.length > 0) ||
    (portfolio.certifications && portfolio.certifications.length > 0)
  );
}

/** True if a resume has enough content that auto-importing INTO it would be destructive. */
export function hasMeaningfulResumeData(resumeData = {}) {
  return Boolean(
    resumeData.title ||
    resumeData.summary ||
    (resumeData.skills && resumeData.skills.length > 0) ||
    (resumeData.experience && resumeData.experience.length > 0) ||
    (resumeData.projects && resumeData.projects.length > 0)
  );
}