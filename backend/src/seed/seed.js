require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/Job');
const User = require('../models/User');
const ensureAdmin = require('./ensureAdmin');

const jobs = [
  {
    title: 'React Developer',
    location: 'Hyderabad',
    department: 'IT',
    experienceMin: 3,
    experienceMax: 5,
    salaryMin: 6,
    salaryMax: 9,
    skills: ['React', 'JavaScript', 'Redux', 'HTML', 'CSS'],
    description:
      'We are hiring a React Developer to build responsive, high-performance web applications for our enterprise clients.',
    responsibilities: [
      'Develop reusable React components and front-end libraries',
      'Translate designs and wireframes into high quality code',
      'Optimise components for performance across devices and browsers',
    ],
    requirements: ['3+ years of experience with React.js', 'Strong JavaScript (ES6+) knowledge', 'Experience with REST APIs'],
    benefits: ['Health insurance', 'Hybrid work', 'Performance bonus'],
  },
  {
    title: 'Java Developer',
    location: 'Bengaluru',
    department: 'IT',
    experienceMin: 2,
    experienceMax: 4,
    salaryMin: 6,
    salaryMax: 8,
    skills: ['Java', 'Spring Boot', 'Microservices', 'SQL'],
    description: 'Design, build and maintain efficient, reusable and reliable Java code for client projects.',
    responsibilities: ['Build Spring Boot microservices', 'Write unit and integration tests', 'Participate in code reviews'],
    requirements: ['2+ years with Java & Spring Boot', 'Good understanding of SQL databases'],
  },
  {
    title: 'HR Executive',
    location: 'Vijayawada',
    department: 'Human Resources',
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 2.5,
    salaryMax: 4,
    skills: ['Recruitment', 'Onboarding', 'MS Excel', 'Communication'],
    description: 'Manage end-to-end recruitment and employee engagement activities.',
    responsibilities: ['Source and screen candidates', 'Coordinate interviews', 'Handle onboarding formalities'],
    requirements: ['MBA / PG in HR preferred', 'Excellent communication skills'],
  },
  {
    title: '.NET Developer',
    location: 'Hyderabad',
    department: 'IT',
    experienceMin: 3,
    experienceMax: 6,
    salaryMin: 6,
    salaryMax: 10,
    skills: ['C#', '.NET Core', 'ASP.NET', 'SQL Server', 'Azure'],
    description: 'Develop and maintain enterprise applications using the Microsoft .NET stack.',
    responsibilities: ['Build Web APIs with .NET Core', 'Maintain SQL Server databases', 'Deploy to Azure'],
    requirements: ['3+ years of .NET experience', 'Hands-on Azure experience is a plus'],
  },
  {
    title: 'Business Analyst',
    location: 'Bengaluru',
    department: 'Business',
    experienceMin: 4,
    experienceMax: 7,
    salaryMin: 7,
    salaryMax: 12,
    skills: ['Requirement Gathering', 'JIRA', 'SQL', 'Stakeholder Management'],
    description: 'Bridge the gap between business stakeholders and technology teams.',
    responsibilities: ['Gather and document requirements', 'Create user stories', 'Support UAT'],
    requirements: ['4+ years as a Business Analyst', 'Strong analytical skills'],
  },
  {
    title: 'Payroll Executive',
    location: 'Vijayawada',
    department: 'Finance',
    experienceMin: 2,
    experienceMax: 4,
    salaryMin: 3,
    salaryMax: 5,
    skills: ['Payroll', 'Statutory Compliance', 'Tally', 'MS Excel'],
    description: 'Process monthly payroll and ensure statutory compliance for client organisations.',
    responsibilities: ['Process payroll for multiple clients', 'Handle PF, ESI and PT filings', 'Resolve employee queries'],
    requirements: ['2+ years of payroll experience', 'Knowledge of Indian labour laws'],
  },
  {
    title: 'Node.js Developer',
    location: 'Chennai',
    department: 'IT',
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 5,
    salaryMax: 10,
    skills: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    description: 'Build scalable backend services and REST APIs with Node.js.',
    responsibilities: ['Design REST APIs', 'Work with MongoDB', 'Integrate third-party services'],
    requirements: ['2+ years of Node.js experience', 'Experience with MongoDB'],
  },
  {
    title: 'Customer Support Executive',
    location: 'Vijayawada',
    department: 'Operations',
    employmentType: 'Full Time',
    experienceMin: 0,
    experienceMax: 2,
    salaryMin: 1.8,
    salaryMax: 3,
    skills: ['Communication', 'Telugu', 'English', 'MS Office'],
    description: 'Handle inbound and outbound customer queries for a leading consumer brand.',
    responsibilities: ['Resolve customer queries over phone and email', 'Maintain call logs'],
    requirements: ['Any graduate', 'Good communication in English and Telugu'],
  },
  {
    title: 'DevOps Engineer',
    location: 'Pune',
    department: 'IT',
    employmentType: 'Contract',
    experienceMin: 4,
    experienceMax: 8,
    salaryMin: 10,
    salaryMax: 18,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    description: 'Own CI/CD pipelines and cloud infrastructure for a fast-growing product company (12 month contract).',
    responsibilities: ['Manage AWS infrastructure', 'Maintain Kubernetes clusters', 'Automate deployments'],
    requirements: ['4+ years in DevOps', 'AWS certification preferred'],
  },
  {
    title: 'Accounts Assistant',
    location: 'Hyderabad',
    department: 'Finance',
    employmentType: 'Part Time',
    experienceMin: 0,
    experienceMax: 1,
    salaryMin: 1.5,
    salaryMax: 2.5,
    skills: ['Tally', 'MS Excel', 'GST'],
    description: 'Support the accounts team with bookkeeping and GST filings.',
    responsibilities: ['Maintain books of accounts', 'Assist in GST returns'],
    requirements: ['B.Com graduate', 'Knowledge of Tally'],
  },
];

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await ensureAdmin();
    const admin = await User.findOne({ role: 'admin' });
    const reset = process.argv.includes('--reset');
    if (reset) await Job.deleteMany({});
    const count = await Job.countDocuments();
    if (count > 0 && !reset) {
      console.log(`Jobs collection already has ${count} jobs - skipping (use "npm run seed -- --reset" to replace).`);
    } else {
      await Job.insertMany(jobs.map((j) => ({ ...j, postedBy: admin?._id })));
      console.log(`Seeded ${jobs.length} jobs`);
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
