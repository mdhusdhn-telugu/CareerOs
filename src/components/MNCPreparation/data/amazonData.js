export const amazonData = {
  id: 'amazon',
  name: 'Amazon',
  fullName: 'Amazon Web Services',
logo: '/logos/amazon.jpg',

  programs: ['SDE-1 (Software Development Engineer)'],
  overview: "Amazon's SDE hiring process is comprehensive and rigorous, focusing heavily on Leadership Principles alongside technical excellence in coding and system design.",
  hiringDetails: {
    eligibility: 'B.Tech/M.Tech in CS/IT or related fields. Strong proficiency in Data Structures & Algorithms is essential. No strict percentage criteria.',
    successRate: 'Extremely low (<1%). One of the most competitive hiring processes globally.',
    hiringCycle: 'On-campus hiring during final year placements and off-campus hiring year-round based on business needs.',
    examMode: 'Fully online process, including online assessments and virtual interview loops.',
    conductingMonths: 'Year-round for off-campus. On-campus drives are typically between August and November.',
    coolingPeriod: 'Typically 6-12 months after a failed interview loop before reapplying for the same role.',
  },
  companyInfo: {
    companyType: "Product-based, US MNC",
    salaryStructure: "SDE-1 Total Compensation: ₹30 - 44 LPA (Package includes base salary, joining bonus, and stock units).",
    workCulture: "Fast-paced and innovative, famously driven by its 16 Leadership Principles. Known for high standards, customer obsession, and a data-driven approach.",
    bond: "No, Amazon typically does not have a service bond or agreement for SDE roles."
  },
  hrInterviewQuestions: [
    {
      question: "Tell me about a time you showed Customer Obsession.",
      answer: "<strong>Strategy:</strong> This is Amazon's #1 Leadership Principle. Your answer MUST be structured using the STAR method (Situation, Task, Action, Result). Focus on a time you went above and beyond for a 'customer' (this could be a user, a professor, or another team).<br><strong>Example:</strong> '<strong>(S)</strong> For our college project, the feedback was that the UI was confusing for new users. <strong>(T)</strong> My task was to improve user onboarding. <strong>(A)</strong> Instead of just adding tooltips, I interviewed five potential users, identified their main pain points, and redesigned the entire initial workflow based on their feedback. <strong>(R)</strong> This resulted in a 40% reduction in user errors and positive feedback from our project guide.'"
    },
    {
      question: "Tell me about a time you took Ownership.",
      answer: "<strong>Strategy:</strong> They want to see that you take initiative and feel responsible for outcomes beyond your immediate tasks. Again, use the STAR method.<br><strong>Example:</strong> '<strong>(S)</strong> While working on a team project, I noticed our code repository had no documentation, making it hard for new members to contribute. <strong>(T)</strong> Although it wasn't my assigned task, I took ownership of this problem. <strong>(A)</strong> I spent a weekend creating a detailed README file, adding code comments, and setting up a clear contribution guide. <strong>(R)</strong> As a result, new members were able to get started in hours instead of days, and our overall team velocity improved.'"
    },
    {
      question: "Why Amazon?",
      answer: "<strong>Strategy:</strong> Be specific. Don't just say it's a big company. Mention the scale of the challenges, the specific technologies (like AWS), and the culture of innovation.<br><strong>Example:</strong> 'I want to work at Amazon because I'm passionate about solving complex problems at a massive scale. The opportunity to work on services that impact millions of customers is incredibly exciting. I'm also drawn to the innovative culture, particularly with services like AWS and Alexa, and I want to be in an environment that is constantly pushing the boundaries of technology.'"
    },
    {
      question: "Tell me about a time you had to Dive Deep.",
      answer: "<strong>Strategy:</strong> This principle is about getting into the details to find the root cause of a problem. Avoid superficial answers. Use STAR.<br><strong>Example:</strong> '<strong>(S)</strong> Our application had a recurring, intermittent bug that was hard to reproduce. <strong>(T)</strong> I was tasked with finding and fixing it. <strong>(A)</strong> Instead of just trying random fixes, I dived deep into the server logs, correlated timestamps with user reports, and added extra logging to narrow down the issue. I discovered the root cause was a rare race condition. <strong>(R)</strong> By understanding the deep technical cause, I was able to implement a proper fix that solved the problem permanently.'"
    }
  ],
  sections: [
    {
      title: 'Amazon SDE Complete Hiring Process',
      content: [
        {
          part: 'Online Assessment (OA) - 90-120 minutes',
          topics: 'Coding Assessment (2 medium/hard problems, 70 mins), Work Style Survey (15 mins), Work Simulation scenarios (20 mins)',
          duration: '90-120 Minutes',
        },
        {
          part: 'Phone/Video Screen - 45 minutes',
          topics: 'Technical coding problem, behavioral questions based on Leadership Principles, system design discussion',
          duration: '45 Minutes',
        },
        {
          part: 'Interview Loop - 4-5 rounds (Full Day)',
          topics: '3-4 Technical rounds (coding + system design), 1-2 Behavioral rounds (Leadership Principles focused), Bar Raiser interview',
          duration: '4-6 Hours',
        },
      ],
    },
    {
      title: 'Technical Interview Deep Dive',
      content: [
        {
          part: 'Coding Interview Focus',
          topics: 'Data Structures: Arrays, LinkedLists, Trees, Graphs, Hash Tables. Algorithms: DFS/BFS, Dynamic Programming, Sorting, Binary Search. Problem-solving approach and optimization',
        },
        {
          part: 'System Design Topics',
          topics: 'Scalability concepts, Load balancing, Database design, Caching strategies, Microservices architecture, AWS services knowledge',
        },
      ],
    },
  ],
  resources: [
    { name: 'Amazon Leadership Principles Guide', link: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles' },
    { name: 'Amazon SDE Interview Prep', link: 'https://amazon.jobs/content/en/how-we-hire/university-roles/sde' },
    { name: 'LeetCode Amazon Questions', link: 'https://leetcode.com/company/amazon/' },
    { name: 'System Design Primer (GitHub)', link: 'https://github.com/donnemartin/system-design-primer' },
  ],
};