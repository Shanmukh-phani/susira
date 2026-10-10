import {
  Banknote,
  Briefcase,
  Building2,
  Cpu,
  FileSignature,
  Handshake,
  HardHat,
  Headset,
  Search,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
} from 'lucide-react'

export const COMPANY = {
  name: 'Susira Solutions',
  shortName: 'Susira',
  tagline: 'Your Partner in Success',
  website: 'susira.in',
  email: 'info@susira.in',
  address: 'Vijayawada, Andhra Pradesh, India',
  about:
    'Delivering exceptional recruitment and staffing solutions to help businesses grow and individuals build successful careers.',
}

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1000&q=80',
  careers: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=70',
  about: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=75',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70',
  team: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=70',
}

export const STATS = [
  { value: '10+', label: 'Years of Excellence', icon: Users },
  { value: '200+', label: 'Client Companies', icon: Building2 },
  { value: '25K+', label: 'Successful Placements', icon: UserCheck },
  { value: '50K+', label: 'Jobs Filled', icon: Briefcase },
]

export const WHY_CHOOSE = [
  { title: 'Quality Talent', text: 'We connect you with skilled professionals who drive growth.', icon: UserCheck },
  { title: 'Industry Focused', text: 'Specialized staffing solutions across multiple domains.', icon: Target },
  { title: 'Client Centric', text: 'Tailored services to meet your unique business needs.', icon: Handshake },
  { title: 'End-to-End Support', text: 'From hiring to payroll, we manage it all for you.', icon: Headset },
]

export const SERVICES = [
  {
    slug: 'recruitment-services',
    title: 'Recruitment Services',
    icon: Search,
    short: 'End-to-end hiring support to find the right people, fast.',
    description:
      'Our recruitment specialists manage the complete hiring lifecycle - from understanding your requirement and sourcing candidates to screening, interview coordination and offer management - so you can focus on running your business.',
    features: [
      'Requirement analysis and job description drafting',
      'Multi-channel candidate sourcing and headhunting',
      'Technical and behavioural screening',
      'Interview scheduling and feedback management',
      'Offer negotiation and joining follow-up',
    ],
  },
  {
    slug: 'contract-staffing',
    title: 'Contract Staffing',
    icon: FileSignature,
    short: 'Flexible, project-based workforce without long-term overheads.',
    description:
      'Scale your teams up or down quickly with pre-screened contract professionals. We handle onboarding, attendance, payroll and compliance while the talent works on your projects.',
    features: [
      'Quick deployment of skilled contract resources',
      'Short-term and long-term contract options',
      'Contract-to-hire flexibility',
      'Complete statutory compliance (PF, ESI, PT)',
      'Single point of contact for all workforce needs',
    ],
  },
  {
    slug: 'permanent-recruitment',
    title: 'Permanent Recruitment',
    icon: UserCheck,
    short: 'Build long-term teams with candidates who fit your culture.',
    description:
      'We help you hire full-time employees who bring the right skills and the right attitude. Our consultants assess cultural fit and long-term potential, not just résumés.',
    features: [
      'Entry, middle and senior level hiring',
      'Leadership and executive search',
      'Culture-fit and background verification',
      'Replacement guarantee on placements',
      'Dedicated account manager',
    ],
  },
  {
    slug: 'payroll-outsourcing',
    title: 'Payroll Outsourcing',
    icon: Banknote,
    short: 'Accurate, compliant and on-time payroll processing.',
    description:
      'Outsource your payroll to us and eliminate errors, delays and compliance risks. We process salaries, statutory deductions, reimbursements and generate all the reports you need.',
    features: [
      'Monthly salary processing and payslips',
      'PF, ESI, PT, TDS and LWF compliance',
      'Full & final settlements',
      'Attendance and leave integration',
      'MIS and audit-ready reports',
    ],
  },
  {
    slug: 'it-staffing',
    title: 'IT Staffing',
    icon: Cpu,
    short: 'Developers, testers, cloud and data specialists on demand.',
    description:
      'From React and Java developers to DevOps, data and cloud engineers, our IT staffing team understands technology and delivers candidates who can contribute from day one.',
    features: [
      'Full-stack, front-end and back-end developers',
      'QA, automation and performance testers',
      'Cloud, DevOps and infrastructure engineers',
      'Data engineering, analytics and AI talent',
      'Technical assessments before submission',
    ],
  },
  {
    slug: 'non-it-staffing',
    title: 'Non-IT Staffing',
    icon: HardHat,
    short: 'Sales, operations, finance, HR and blue-collar workforce.',
    description:
      'We source reliable talent for non-technical roles across manufacturing, retail, BFSI, logistics, healthcare and more - including bulk and volume hiring.',
    features: [
      'Sales, marketing and business development',
      'Accounts, finance and HR professionals',
      'Customer support and operations staff',
      'Skilled and semi-skilled workforce',
      'Volume and campus hiring drives',
    ],
  },
]

export const CLIENTS = [
  { name: 'TechNova Systems', industry: 'Information Technology', city: 'Hyderabad' },
  { name: 'Apex Financial Services', industry: 'Banking & Finance', city: 'Bengaluru' },
  { name: 'GreenLeaf Manufacturing', industry: 'Manufacturing', city: 'Vijayawada' },
  { name: 'MediCare Hospitals', industry: 'Healthcare', city: 'Chennai' },
  { name: 'UrbanMart Retail', industry: 'Retail', city: 'Hyderabad' },
  { name: 'SwiftLogix', industry: 'Logistics', city: 'Visakhapatnam' },
  { name: 'CloudPeak Software', industry: 'SaaS', city: 'Pune' },
  { name: 'BrightPath Education', industry: 'Education', city: 'Vijayawada' },
  { name: 'Zenith Telecom', industry: 'Telecom', city: 'Bengaluru' },
  { name: 'Prime Infra Projects', industry: 'Infrastructure', city: 'Guntur' },
  { name: 'NextGen Pharma', industry: 'Pharmaceuticals', city: 'Hyderabad' },
  { name: 'BlueOcean BPO', industry: 'BPO / KPO', city: 'Chennai' },
]

export const INDUSTRIES = [
  'Information Technology',
  'Banking & Finance',
  'Healthcare',
  'Manufacturing',
  'Retail & E-commerce',
  'Logistics',
  'Education',
  'Telecom',
]

export const TESTIMONIALS = [
  {
    quote:
      'Susira helped us scale our engineering team from 15 to 60 within six months. The quality of profiles was consistently excellent.',
    name: 'Ravi Kumar',
    role: 'CTO, TechNova Systems',
  },
  {
    quote: 'Their payroll outsourcing has been flawless. Zero compliance issues since we partnered with them.',
    name: 'Anitha Reddy',
    role: 'HR Head, GreenLeaf Manufacturing',
  },
  {
    quote: 'Responsive, transparent and genuinely invested in finding the right fit. Highly recommended.',
    name: 'Suresh Babu',
    role: 'Operations Director, SwiftLogix',
  },
]

export const VALUES = [
  { title: 'Integrity', text: 'Honest, transparent relationships with clients and candidates.', icon: ShieldCheck },
  { title: 'Excellence', text: 'Rigorous processes that deliver quality outcomes every time.', icon: Target },
  { title: 'Partnership', text: 'We succeed only when our clients and candidates succeed.', icon: Handshake },
]

export const CAREER_RESOURCES = [
  {
    title: 'Writing a resume that gets shortlisted',
    points: [
      'Keep it to 1-2 pages with a clear summary at the top.',
      'List achievements with numbers, not just responsibilities.',
      'Tailor your skills section to the job description.',
      'Save and upload as PDF so formatting stays intact.',
    ],
  },
  {
    title: 'Preparing for interviews',
    points: [
      'Research the company, its products and recent news.',
      'Prepare STAR-format stories for common behavioural questions.',
      'Revise core technical concepts listed in the job description.',
      'Prepare two or three thoughtful questions for the interviewer.',
    ],
  },
  {
    title: 'Making your profile stand out',
    points: [
      'Complete every section of your candidate profile.',
      'Add your key skills so our recruiters can match you faster.',
      'Keep your resume up to date after every project or role change.',
      'Respond quickly when a recruiter reaches out.',
    ],
  },
  {
    title: 'Negotiating your offer',
    points: [
      'Know the market range for your role and experience.',
      'Consider the full package - benefits, growth and flexibility.',
      'Be clear and polite about your expectations.',
      'Get the final offer in writing before resigning.',
    ],
  },
]
