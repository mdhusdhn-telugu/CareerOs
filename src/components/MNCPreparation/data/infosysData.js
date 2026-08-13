export const infosysData = {
  id: 'infosys',
  name: 'Infosys',
  fullName: 'Infosys Limited',
  logo: '/logos/infosys.jpg',
  programs: ['InfyTQ Certification', 'Systems Engineer'],
  overview: 'InfyTQ is a certification program that validates programming and database skills, offering direct interview opportunities for various roles at Infosys.',
  hiringDetails: {
    eligibility: 'Final year B.E./B.Tech/M.E./M.Tech/MCA/M.Sc students. No active backlogs are allowed. Typically requires 60%+ in academics.',
    successRate: 'Moderate. Passing the certification is achievable, but securing a top-tier role (Power Programmer) is highly competitive.',
    hiringCycle: 'Mainly through specific drives like InfyTQ, HackWithInfy, or dedicated campus recruitment events.',
    examMode: 'Online remote-proctored examinations.',
    conductingMonths: 'InfyTQ is usually held annually, often announced between January and March.',
    coolingPeriod: 'Candidates who do not clear one hiring process are typically not eligible for other Infosys drives for the next 6 months.',
  },
  companyInfo: {
    companyType: "Service-based, Indian MNC",
    salaryStructure: "Systems Engineer: ~₹3.6 LPA | Digital Specialist: ~₹6.25 LPA | Power Programmer: ~₹9.5 LPA",
    workCulture: "Famous for its world-class fresher training at the Mysore campus. A professional, corporate culture with a strong emphasis on continuous learning.",
    bond: "Yes, there is typically a 1-year service agreement for the Systems Engineer role."
  },
  hrInterviewQuestions: [
    {
      question: "Why do you want to join Infosys?",
      answer: "<strong>Strategy:</strong> Highlight their reputation for training and global exposure. Mentioning specific Infosys platforms (like Infosys Cobalt) shows deeper research.<br><strong>Example:</strong> 'I have immense respect for Infosys's reputation as a pioneer in the Indian IT industry and for its world-class training program at the Mysore campus. I am keen to start my career in an environment that values continuous learning and offers the chance to work with global clients on cutting-edge digital transformation projects.'"
    },
    {
      question: "Are you willing to learn any technology?",
      answer: "<strong>Strategy:</strong> For a service-based company, adaptability is a key trait. Your answer should be an enthusiastic 'yes'.<br><strong>Example:</strong> 'Absolutely. I am passionate about technology and believe that learning is a lifelong process in this field. Whether it's cloud computing, AI, or another emerging technology, I am eager to learn whatever is required to contribute effectively to my team and the project's goals.'"
    },
    {
      question: "Explain your final year project.",
      answer: "<strong>Strategy:</strong> This is a very common question. Structure your answer clearly. Explain the problem statement, the technology stack you used, your specific role and contribution, and the final outcome or learning.<br><strong>Example:</strong> 'Our project was a web application to manage library books. We used the MERN stack. My primary role was to develop the back-end APIs using Node.js and Express for book issuance and return. A key challenge was managing the database schema efficiently, which I solved by... The project taught me a lot about the software development lifecycle.'"
    },
    {
      question: "What are your salary expectations?",
      answer: "<strong>Strategy:</strong> For fresher roles at large MNCs, the salary is usually standardized and non-negotiable. It's best to show that you are flexible and trust the company's standards.<br><strong>Example:</strong> 'As a fresher, my main priority is to gain valuable experience and learn from a reputed company like Infosys. I am confident that the compensation you offer will be in line with industry standards and my qualifications. I am happy to accept the standard package for this role.'"
    }
  ],
  sections: [
    {
      title: 'Complete InfyTQ 2025 Pattern',
      content: [
        {
          part: 'Certification Round (180 minutes total)',
          topics: 'Programming Hands-on (Java/Python - 2 questions), Programming MCQs (Java/Python - 10 questions), DBMS MCQs (10 questions)',
          duration: '180 Minutes (Shared)',
        },
        {
          part: 'Advantage Round (180 minutes)',
          topics: 'Advanced Coding Problems (3 questions with different weightage totaling 225 marks)',
          duration: '180 Minutes',
        },
        {
          part: 'Behavioral Interview',
          topics: 'Technical discussion on projects, problem-solving approach, cultural fit assessment',
          duration: '30-45 Minutes',
        },
      ],
    },
    {
      title: 'Detailed Technical Syllabus',
      content: [
        {
          part: 'Java Programming Topics',
          topics: 'OOP Concepts (Inheritance, Polymorphism, Encapsulation), Collections Framework, Exception Handling, Multithreading, Abstract classes and Interfaces, String manipulation, Recursion',
        },
        {
          part: 'Python Programming Topics',
          topics: 'Data Structures (Lists, Tuples, Dictionaries, Sets), Control Structures, Functions and Modules, OOP in Python, File Handling, Exception Handling, Libraries (NumPy, Pandas basics)',
        },
        {
          part: 'Database Management System',
          topics: 'SQL Basics (SELECT, INSERT, UPDATE, DELETE), Joins (INNER, OUTER, LEFT, RIGHT), Normalization (1NF, 2NF, 3NF), Subqueries and Views, Transactions and ACID properties, NoSQL basics',
        },
        {
          part: 'Advanced Coding Areas',
          topics: 'Data Structures implementation, Algorithm optimization, Dynamic Programming, Graph algorithms, Tree traversals, String algorithms',
        },
      ],
    },
  ],
  resources: [
    { name: 'InfyTQ Official Portal', link: 'https://infytq.infosys.com/' },
    { name: 'Java Programming Practice', link: 'https://infytq.infosys.com/java-fundamentals' },
    { name: 'Python Programming Practice', link: 'https://infytq.infosys.com/python-fundamentals' },
    { name: 'Database Practice Questions', link: 'https://infytq.infosys.com/database-fundamentals' },
  ],
};