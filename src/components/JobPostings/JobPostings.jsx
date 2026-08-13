// src/components/JobPostings/JobPostings.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoBriefcaseOutline,
  IoFilter,
  IoClose,
  IoGlobeOutline,
  IoTimeOutline,
  IoBusinessOutline,
  IoArrowForward,
  IoBookmarkOutline,
  IoBookmark,
  IoCheckmarkCircle
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./JobPostings.css";

// --- Components ---

const SkeletonCard = () => (
  <div className="job-card skeleton">
    <div className="skeleton-header">
      <div className="skeleton-box logo"></div>
      <div className="skeleton-info">
        <div className="skeleton-box title"></div>
        <div className="skeleton-box sub"></div>
      </div>
    </div>
    <div className="skeleton-box line"></div>
    <div className="skeleton-box line half"></div>
    <div className="skeleton-box button"></div>
  </div>
);

const JobDetailDrawer = ({ job, onClose, onSave, isSaved }) => {
  if (!job) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="job-drawer">
        <div className="drawer-header">
          <button className="drawer-close-btn" onClick={onClose}>
            <IoClose /> Esc
          </button>
        </div>
        
        <div className="drawer-content">
          <div className="drawer-hero">
            <img
              src={job.employer_logo || "https://via.placeholder.com/80?text=Job"} 
              alt={`${job.employer_name} logo`}
              className="drawer-logo"
              onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Job"; }}
            />
            <h2 className="drawer-title">{job.job_title}</h2>
            <div className="drawer-company-row">
               <IoBusinessOutline /> <span>{job.employer_name}</span>
            </div>
          </div>

          <div className="drawer-tags">
            <div className="tag"><IoLocationOutline /> {job.job_city || "Remote / Unspecified"}</div>
            <div className="tag"><IoBriefcaseOutline /> {job.job_employment_type || "Full Time"}</div>
            {job.job_is_remote && <div className="tag highlight"><IoGlobeOutline /> Remote</div>}
            <div className="tag"><IoTimeOutline /> Posted recently</div>
          </div>

          <div className="drawer-section">
            <h4>Description</h4>
            <p className="job-description-text">
                {job.job_description ? (
                    job.job_description.length > 800 
                    ? job.job_description.substring(0, 800) + "..." 
                    : job.job_description
                ) : "No description provided."}
            </p>
          </div>

          {/* NEW FOOTER DESIGN */}
          <div className="drawer-footer">
            {/* 1. SAVE BUTTON (Secondary) */}
            <button 
                className={`btn-save-job ${isSaved ? 'saved' : ''}`} 
                onClick={() => onSave(job)}
                disabled={isSaved}
            >
                {isSaved ? <IoCheckmarkCircle /> : <IoBookmarkOutline />}
                {isSaved ? "Saved to Profile" : "Save Job"}
            </button>

            {/* 2. APPLY BUTTON (Primary - External Link) */}
            <a 
                href={job.job_apply_link} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-apply-external"
            >
                Apply on Company Site <IoArrowForward />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const JobPostings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("Software Engineer");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    FULLTIME: false,
    PARTTIME: false,
    INTERN: false,
    CONTRACTOR: false,
  });
  
  // Renamed logic to "Saved Jobs"
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem("savedJobs");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const fetchJobs = useCallback(async (pageNum = 1, query, activeFilters) => {
    setIsLoading(true);
    setError(null);
    const employmentTypes = Object.keys(activeFilters)
      .filter(key => activeFilters[key])
      .join(',');

    try {
      const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
          query: query,
          page: pageNum.toString(),
          num_pages: '1',
          employment_types: employmentTypes || null,
        },
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_JSEARCH_API_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      };
      const response = await axios.request(options);
      const newJobs = response.data.data || [];
      setJobs(prev => (pageNum === 1 ? newJobs : [...prev, ...newJobs]));
    } catch (err) {
      console.error(err);
      setError("Unable to fetch job streams. Verify API connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(1, "Software Engineer", filters);
    // eslint-disable-next-line
  }, []);

  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    setPage(1);
    fetchJobs(1, searchQuery, filters);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchJobs(1, searchQuery, filters);
    setShowFilters(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, searchQuery, filters);
  };

  const handleSaveJob = async (job) => {
    if (!user) {
        alert("Please login to save jobs.");
        return;
    }
    if (savedJobs.includes(job.job_id)) return;

    try {
      // Saving to "saved_jobs" collection or "applications" depending on your preference
      await setDoc(doc(db, "users", user.uid, "saved_jobs", job.job_id), {
        job_id: job.job_id,
        job_title: job.job_title || "No Job Title",
        employer_name: job.employer_name || "No Company Name",
        employer_logo: job.employer_logo || null,
        job_city: job.job_city || "NA",
        job_employment_type: job.job_employment_type || "NA",
        job_apply_link: job.job_apply_link || "",
        timestamp: serverTimestamp(),
      });

      setSavedJobs(prev => [...prev, job.job_id]);
    } catch (err) {
      console.error("Error saving job", err);
      alert("System Error: Could not save job.");
    }
  };
  
  return (
    <div className="jobs-page-wrapper">
      <JobDetailDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onSave={handleSaveJob}
        isSaved={selectedJob && savedJobs.includes(selectedJob.job_id)}
      />

      <main className="jobs-main-content">
        <header className="jobs-header-section">
          <h1 className="page-title">
            Global <span className="highlight-text">Opportunity</span> Stream
          </h1>
          <p className="page-subtitle">
            CodeAstra provides a centralized intelligence stream for developers, aggregating high-signal engineering roles from top-tier tech corporations to accelerate your career trajectory.
          </p>

          <div className="search-interface">
            <div className="search-bar-wrapper">
              <IoSearchOutline className="search-icon"/>
              <input 
                type="text" 
                placeholder="Search by role, stack, or company..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKey} 
              />
              <div className="kbd-shortcut">↵</div>
            </div>
            
            <button className={`btn-filter ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <IoFilter /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <span className="filter-label">Employment Type:</span>
                <label className="checkbox-pill">
                  <input type="checkbox" name="FULLTIME" checked={filters.FULLTIME} onChange={handleFilterChange} />
                  Full-time
                </label>
                <label className="checkbox-pill">
                  <input type="checkbox" name="PARTTIME" checked={filters.PARTTIME} onChange={handleFilterChange} />
                  Part-time
                </label>
                <label className="checkbox-pill">
                  <input type="checkbox" name="INTERN" checked={filters.INTERN} onChange={handleFilterChange} />
                  Internship
                </label>
                <label className="checkbox-pill">
                  <input type="checkbox" name="CONTRACTOR" checked={filters.CONTRACTOR} onChange={handleFilterChange} />
                  Contract
                </label>
              </div>
              <button className="btn-run-filter" onClick={handleApplyFilters}>Update Stream</button>
            </div>
          )}
        </header>

        <section className="results-section">
          {error && !isLoading && <div className="state-message error">{error}</div>}
          
          <div className="job-cards-grid">
            {isLoading && page === 1 
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : jobs.map(job => (
                    <div key={job.job_id} className="job-card" onClick={() => setSelectedJob(job)}>
                      <div className="card-top-row">
                        <img 
                            src={job.employer_logo || "https://via.placeholder.com/50?text=Job"} 
                            alt="logo" 
                            className="company-logo"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Job"; }}
                        />
                        <div className="job-badges">
                           {job.job_is_remote && <span className="badge remote">Remote</span>}
                           {savedJobs.includes(job.job_id) && <span className="badge saved"><IoBookmark /> Saved</span>}
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <h3 className="job-title">{job.job_title}</h3>
                        <p className="company-name">{job.employer_name}</p>
                        
                        <div className="meta-row">
                          <span><IoLocationOutline /> {job.job_city ? job.job_city.split(',')[0] : "NA"}</span>
                          <span><IoBriefcaseOutline /> {job.job_employment_type || "Full Time"}</span>
                        </div>
                      </div>

                      <div className="card-actions">
                         <span className="view-details">View & Apply <IoArrowForward /></span>
                      </div>
                    </div>
                ))
            }
          </div>

          {!isLoading && jobs.length === 0 && !error && (
             <div className="state-message empty">
                <h3>No signals found.</h3>
                <p>Try refining your search query or filters.</p>
             </div>
          )}

          {!isLoading && jobs.length > 0 && (
             <div className="pagination-wrapper">
                <button onClick={handleLoadMore} className="btn-load-more">Load Next Page</button>
             </div>
          )}
          
          {isLoading && page > 1 && <div className="state-message loading">Syncing more data...</div>}
        </section>
      </main>
    </div>
  );
};

export default JobPostings;