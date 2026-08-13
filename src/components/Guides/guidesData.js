export const guidesContent = [
  // --- CATEGORY 1: CAREER ROADMAPS ---
  {
    id: 1,
    title: "The 2025 Full Stack Roadmap",
    date: "Updated Dec 2025",
    readTime: "8 min read",
    tag: "Roadmap",
    content: `
      <h2>Phase 1: The Foundation (Months 1-2)</h2>
      <p>Before jumping into frameworks, you must master the building blocks. Do not skip this.</p>
      <ul>
        <li><strong>HTML5:</strong> Semantic tags, accessibility, forms, and SEO basics.</li>
        <li><strong>CSS3:</strong> Flexbox, Grid, Animations, Responsive Design, and Variables.</li>
        <li><strong>JavaScript (ES6+):</strong> Arrow functions, Promises, Async/Await, DOM manipulation, and Modules.</li>
      </ul>

      <h2>Phase 2: The Frontend Ecosystem (Months 3-4)</h2>
      <p>Now that you know JavaScript, it's time to learn React. It is the industry standard for 2025.</p>
      <ul>
        <li><strong>React:</strong> Components, Props, State, Hooks (useState, useEffect, useContext).</li>
        <li><strong>Tailwind CSS:</strong> Speed up your styling workflow with utility classes.</li>
        <li><strong>State Management:</strong> Redux Toolkit or Zustand for complex apps.</li>
      </ul>

      <h2>Phase 3: The Backend & Database (Months 5-6)</h2>
      <p>To be a full stack developer, you need to handle data and server logic.</p>
      <ul>
        <li><strong>Node.js & Express:</strong> Building REST APIs and handling middleware.</li>
        <li><strong>Databases:</strong> MongoDB (NoSQL) for flexibility or PostgreSQL (SQL) for structure.</li>
        <li><strong>Authentication:</strong> JWT (JSON Web Tokens) and OAuth (Google Login).</li>
      </ul>

      <h2>Phase 4: Deployment & DevOps</h2>
      <p>Your code is useless if it stays on your laptop.</p>
      <ul>
        <li><strong>Git:</strong> Branching, Merging, Pull Requests, and resolving conflicts.</li>
        <li><strong>Hosting:</strong> Vercel (Frontend), Render/Railway (Backend).</li>
        <li><strong>CI/CD:</strong> Basic GitHub Actions to automate your testing and deployment.</li>
      </ul>
    `
  },
  {
    id: 2,
    title: "Frontend vs Backend: The Choice",
    date: "Nov 2025",
    readTime: "5 min read",
    tag: "Career",
    content: `
      <h2>The Visuals vs. The Logic</h2>
      <p>Many students are confused about which path to take. Here is the breakdown.</p>
      
      <h3>Frontend Development</h3>
      <p><strong>Focus:</strong> What the user sees and interacts with.</p>
      <p><strong>Who is it for?</strong> People who care about design, user experience, and visual creativity.</p>
      <p><strong>Key Tech:</strong> React, Vue, CSS, Tailwind, Figma.</p>

      <h3>Backend Development</h3>
      <p><strong>Focus:</strong> Server logic, databases, APIs, and performance.</p>
      <p><strong>Who is it for?</strong> People who like logic, algorithms, and system architecture.</p>
      <p><strong>Key Tech:</strong> Node.js, Python (Django/FastAPI), Java (Spring Boot), SQL.</p>

      <h3>Which pays more?</h3>
      <p>Entry-level salaries are similar. However, specialized Backend Engineers and DevOps Engineers often have a higher ceiling in the long run due to the complexity of scaling systems.</p>
    `
  },
  {
    id: 3,
    title: "From BCA to Your First Job",
    date: "Oct 2025",
    readTime: "6 min read",
    tag: "Planning",
    content: `
      <h2>The Reality Check</h2>
      <p>BCA degrees often focus on theory. To get hired, you need practical skills that are not taught in the classroom.</p>

      <h3>1st Year: Exploration</h3>
      <ul>
        <li>Learn C++ or Java to understand strict typing and memory management.</li>
        <li>Start exploring Web Development (HTML/CSS).</li>
        <li>Build a simple personal website.</li>
      </ul>

      <h3>2nd Year: Projects & DSA</h3>
      <ul>
        <li><strong>Data Structures:</strong> Start solving easy problems on LeetCode or CodeAstra.</li>
        <li><strong>Development:</strong> Build a real project (e.g., a To-Do App with a database).</li>
        <li><strong>Hackathons:</strong> Participate in at least one college hackathon.</li>
      </ul>

      <h3>3rd Year: Portfolio & Interviews</h3>
      <ul>
        <li>Create a "Hero Project" (a full-stack clone of a major app like Netflix or Twitter).</li>
        <li>Prepare your resume using ATS-friendly templates.</li>
        <li>Apply for internships aggressively.</li>
      </ul>
    `
  },

  // --- CATEGORY 2: ESSENTIAL HOW-TO'S ---
  {
    id: 4,
    title: "The Ultimate Resume Checklist",
    date: "Dec 2025",
    readTime: "4 min read",
    tag: "Resume",
    content: `
      <h2>Stop Getting Rejected by Robots</h2>
      <p>Most resumes are rejected by ATS (Applicant Tracking Systems) before a human ever sees them.</p>

      <h3>The Golden Rules</h3>
      <ul>
        <li><strong>Single Column:</strong> Fancy dual-column designs confuse ATS parsers. Keep it simple.</li>
        <li><strong>Metrics, Not Responsibilities:</strong> Don't say "Worked on frontend." Say "Improved page load speed by 30% using React."</li>
        <li><strong>Keywords:</strong> Include the exact skills listed in the job description.</li>
      </ul>

      <h3>Section Order</h3>
      <ol>
        <li><strong>Contact Info:</strong> Name, Phone, Email, GitHub, LinkedIn.</li>
        <li><strong>Skills:</strong> Group them (Languages, Frameworks, Tools).</li>
        <li><strong>Experience/Projects:</strong> The most important section. Use bullet points.</li>
        <li><strong>Education:</strong> Keep it brief unless you are a topper.</li>
      </ol>
    `
  },
  {
    id: 5,
    title: "Mastering the Technical Interview",
    date: "Dec 2025",
    readTime: "10 min read",
    tag: "Interview",
    content: `
      <h2>The Standard Process</h2>
      <p>Most tech interviews follow this pattern:</p>
      
      <h3>1. The Introduction (5 min)</h3>
      <p>Prepare your "Elevator Pitch." Who are you, what have you built, and why do you want this role?</p>

      <h3>2. DSA Problem Solving (30-40 min)</h3>
      <p>You will be given a problem. <strong>Do not start coding immediately.</strong></p>
      <ul>
        <li>Ask clarifying questions.</li>
        <li>Explain your logic out loud (Brute force first, then optimize).</li>
        <li>Write clean code with proper variable names.</li>
        <li>Dry run your code with edge cases.</li>
      </ul>

      <h3>3. System Design / Core Concepts (10 min)</h3>
      <p>Expect questions on OOPs, DBMS, or how the internet works.</p>
    `
  },
  {
    id: 6,
    title: "Building a Portfolio that Hires",
    date: "Nov 2025",
    readTime: "7 min read",
    tag: "Portfolio",
    content: `
      <h2>Quality Over Quantity</h2>
      <p>Recruiters spend about 30 seconds on your portfolio. Make it count.</p>

      <h3>What to Include</h3>
      <ul>
        <li><strong>Live Links:</strong> If they can't click and see it working, it doesn't count. Deploy on Vercel/Netlify.</li>
        <li><strong>Source Code:</strong> Clean, organized GitHub repositories.</li>
        <li><strong>Case Studies:</strong> A specialized page explaining <em>how</em> you built your best project.</li>
      </ul>

      <h3>What to Avoid</h3>
      <ul>
        <li>Calculator Apps or To-Do lists (too basic).</li>
        <li>Broken links.</li>
        <li>Slow loading websites.</li>
      </ul>
    `
  },

  // --- CATEGORY 3: TECHNICAL CHEATSHEETS ---
  {
    id: 7,
    title: "Git & GitHub Essentials",
    date: "Sep 2025",
    readTime: "3 min read",
    tag: "Git",
    content: `
      <h2>Daily Commands</h2>
      <pre><code>
git init          # Start a new repo
git status        # See what changed
git add .         # Stage all changes
git commit -m "msg" # Save changes
git push origin main # Send to GitHub
      </code></pre>

      <h2>Emergency Fixes</h2>
      <pre><code>
git checkout -b new-branch  # Create new branch
git pull origin main        # Update your local code
git reset --hard HEAD       # Undo all changes (Be careful!)
      </code></pre>
    `
  },
  {
    id: 8,
    title: "React Hooks Pocket Guide",
    date: "Oct 2025",
    readTime: "5 min read",
    tag: "React",
    content: `
      <h2>useState</h2>
      <p>Used for tracking data that changes.</p>
      <pre><code>const [count, setCount] = useState(0);</code></pre>

      <h2>useEffect</h2>
      <p>Used for side effects like API calls.</p>
      <pre><code>useEffect(() => { 
  console.log("Component Mounted");
}, []); // Empty array = run once</code></pre>

      <h2>useContext</h2>
      <p>Used to avoid prop drilling (global state).</p>
      
      <h2>useRef</h2>
      <p>Used to access DOM elements directly without re-rendering.</p>
    `
  },
  {
    id: 9,
    title: "Python Tricks for Interviews",
    date: "Dec 2025",
    readTime: "4 min read",
    tag: "Python",
    content: `
      <h2>List Comprehensions</h2>
      <p>Write cleaner loops in one line.</p>
      <pre><code>squared = [x**2 for x in range(10)]</code></pre>

      <h2>String Manipulation</h2>
      <pre><code>s = "racecar"
is_palindrome = s == s[::-1] # Reverse string trick</code></pre>

      <h2>Dictionary Get</h2>
      <p>Avoid errors when a key doesn't exist.</p>
      <pre><code>count = my_dict.get('item', 0)</code></pre>
    `
  },

  // --- CATEGORY 4: STUDENT SURVIVAL ---
  {
    id: 10,
    title: "Open Source for Beginners",
    date: "Oct 2025",
    readTime: "6 min read",
    tag: "Open Source",
    content: `
      <h2>Why Open Source?</h2>
      <p>It is the best way to prove you can work in a large codebase with other developers.</p>

      <h3>How to Start</h3>
      <ol>
        <li>Find a repository with the tag <strong>"good first issue"</strong>.</li>
        <li>Read the CONTRIBUTING.md file carefully.</li>
        <li>Fork the repo and clone it locally.</li>
        <li>Fix the bug or add the feature.</li>
        <li>Submit a Pull Request (PR).</li>
      </ol>
    `
  },
  {
    id: 11,
    title: "LinkedIn Optimization Guide",
    date: "Nov 2025",
    readTime: "5 min read",
    tag: "Networking",
    content: `
      <h2>Your Digital Resume</h2>
      <p>Recruiters search LinkedIn before they check job portals.</p>

      <h3>Profile Essentials</h3>
      <ul>
        <li><strong>Headline:</strong> Not just "Student". Use "Full Stack Developer | React, Node.js | CS Undergrad".</li>
        <li><strong>About:</strong> Write a story about what you love building.</li>
        <li><strong>Featured:</strong> Pin your best projects and your resume.</li>
      </ul>

      <h3>Networking Strategy</h3>
      <p>Don't just click "Connect". Send a note: "Hi [Name], I saw your post about X. I'm a developer learning Y and would love to connect."</p>
    `
  }
];