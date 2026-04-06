export const COMPANIES = [
  { id: 'ihc', name: 'IHC Group', color: '#1B3A6B', short: 'IHC', logo: '/logos/ihc.svg' },
  { id: 'aldar', name: 'Aldar Properties', color: '#C8973A', short: 'ALD', logo: '/logos/aldar.svg' },
  { id: 'shory', name: 'Shory', color: '#0D9488', short: 'SHR', logo: '/logos/shory.svg' },
  { id: 'purehealth', name: 'PureHealth', color: '#059669', short: 'PHG', logo: '/logos/purehealth.svg' },
  { id: 'easylease', name: 'EasyLease', color: '#7C3AED', short: 'EZL', logo: '/logos/easylease.svg' },
  { id: 'ghitha', name: 'Ghitha', color: '#DC2626', short: 'GHT', logo: '/logos/ghitha.svg' },
  { id: 'palms', name: 'Palms Sports', color: '#EA580C', short: 'PLS', logo: '/logos/palms-sports.svg' },
];

export const MOCK_USERS: Record<string, {
  id: string; name: string; email: string; company: string; companyId: string;
  title: string; department: string; employeeId: string; avatar: string; location: string;
  image: string;
}> = {
  'sara.ahmed@shory.ae': {
    id: 'u001', name: 'Sara Ahmed', email: 'sara.ahmed@shory.ae',
    company: 'Shory', companyId: 'shory', title: 'Senior Product Manager',
    department: 'Product & Innovation', employeeId: 'SHR-2847',
    avatar: 'SA', location: 'Abu Dhabi, UAE',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  'khalid.mansouri@aldar.ae': {
    id: 'u002', name: 'Khalid Al Mansouri', email: 'khalid.mansouri@aldar.ae',
    company: 'Aldar Properties', companyId: 'aldar', title: 'Real Estate Director',
    department: 'Asset Management', employeeId: 'ALD-1094',
    avatar: 'KM', location: 'Abu Dhabi, UAE',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  'noura.hassan@purehealth.ae': {
    id: 'u003', name: 'Noura Hassan', email: 'noura.hassan@purehealth.ae',
    company: 'PureHealth', companyId: 'purehealth', title: 'Clinical Operations Lead',
    department: 'Healthcare Operations', employeeId: 'PHG-3321',
    avatar: 'NH', location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
  'ali.rashid@ihcgroup.ae': {
    id: 'u004', name: 'Ali Rashid', email: 'ali.rashid@ihcgroup.ae',
    company: 'IHC Group', companyId: 'ihc', title: 'Group Strategy Manager',
    department: 'Corporate Strategy', employeeId: 'IHC-0512',
    avatar: 'AR', location: 'Abu Dhabi, UAE',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
};

export const CORPORATE_NEWS = [
  {
    id: 'cn001',
    title: 'IHC Chairman Addresses Future of UAE Investment at ADGM',
    summary: 'His Excellency outlines IHC\'s vision for sustainable growth and regional expansion at the Abu Dhabi Global Market annual summit.',
    date: '06 Apr 2026',
    readTime: '3 min read',
    tags: ['ADGM', 'Leadership'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
    author: 'IHC Communications',
  },
  {
    id: 'cn002',
    title: 'IHC Group Reports Record Q1 2026 — Revenue Up 22%',
    summary: 'Group revenue reaches AED 14.8 billion driven by strong performance across healthcare, real estate, and technology verticals.',
    date: '03 Apr 2026',
    readTime: '2 min read',
    tags: ['Financial', 'Quarterly'],
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=500&fit=crop',
    author: 'Investor Relations',
  },
  {
    id: 'cn003',
    title: 'CEO Town Hall: Building the Next Chapter Together',
    summary: 'Group CEO shares strategic priorities for 2026 including AI transformation, employee wellness, and market expansion into Southeast Asia.',
    date: '01 Apr 2026',
    readTime: '4 min read',
    tags: ['CEO', 'Strategy'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop&crop=face',
    author: 'Office of the CEO',
  },
  {
    id: 'cn004',
    title: 'IHC Signs MoU with Hub71 to Accelerate Startup Ecosystem',
    summary: 'Strategic partnership aims to support 50+ UAE-based startups with funding, mentorship and access to IHC\'s network of companies.',
    date: '28 Mar 2026',
    readTime: '2 min read',
    tags: ['Hub71', 'Innovation'],
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop',
    author: 'IHC Ventures',
  },
];

export const IHC_ANNOUNCEMENTS = [
  {
    id: 'ann001', type: 'group', tag: 'IHC Group',
    title: 'IHC Reports Record Q3 2024 Performance',
    summary: 'Group revenue reaches AED 12.4 billion with 18% YoY growth across all subsidiaries.',
    date: '15 Oct 2024', urgent: false,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop',
    category: 'Financial',
  },
  {
    id: 'ann002', type: 'group', tag: 'IHC Group',
    title: 'IHC Sustainability Summit — Register Now',
    summary: 'All-group sustainability event at ADNEC on November 12. Employee registration now open.',
    date: '10 Oct 2024', urgent: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
    category: 'Events',
  },
  {
    id: 'ann003', type: 'group', tag: 'IHC Group',
    title: 'New Employee Benefits Programme 2025',
    summary: 'Enhanced health, wellness and education benefits take effect January 1st.',
    date: '5 Oct 2024', urgent: true,
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&h=300&fit=crop',
    category: 'HR',
  },
];

export const COMPANY_ANNOUNCEMENTS: Record<string, typeof IHC_ANNOUNCEMENTS> = {
  shory: [
    {
      id: 'sann001', type: 'company', tag: 'Shory',
      title: 'Shory Motor Insurance — Employee Exclusive Rate',
      summary: 'All Shory employees qualify for 30% off comprehensive motor insurance this month.',
      date: '14 Oct 2024', urgent: false,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=300&fit=crop',
      category: 'Offers',
    },
    {
      id: 'sann002', type: 'company', tag: 'Shory',
      title: 'New UAE Insurance Regulations — Compliance Update',
      summary: 'Important regulatory changes effective Q1 2025. Mandatory briefing sessions scheduled.',
      date: '9 Oct 2024', urgent: true,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=300&fit=crop',
      category: 'Compliance',
    },
  ],
  aldar: [
    {
      id: 'aann001', type: 'company', tag: 'Aldar Properties',
      title: 'Yas Island Phase III — Employee Early Access',
      summary: 'Aldar employees get 48-hour early access to new unit releases at Yas Island.',
      date: '13 Oct 2024', urgent: false,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=300&fit=crop',
      category: 'Property',
    },
    {
      id: 'aann002', type: 'company', tag: 'Aldar Properties',
      title: 'Aldar Rewards Points — Triple Points November',
      summary: 'Earn triple points on all Aldar services and amenities throughout November.',
      date: '8 Oct 2024', urgent: false,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=300&fit=crop',
      category: 'Rewards',
    },
  ],
  purehealth: [
    {
      id: 'pann001', type: 'company', tag: 'PureHealth',
      title: 'Annual Health Screening — Book Your Slot',
      summary: 'Complimentary full health screening available at all PureHealth facilities. Book by Oct 31.',
      date: '12 Oct 2024', urgent: false,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=300&fit=crop',
      category: 'Wellness',
    },
    {
      id: 'pann002', type: 'company', tag: 'PureHealth',
      title: 'New Mental Health Support Programme',
      summary: 'Confidential mental health support now available. Sessions with certified counselors.',
      date: '7 Oct 2024', urgent: false,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop',
      category: 'Wellness',
    },
  ],
};

export const OFFERS = [
  {
    id: 'off001', company: 'Aldar Properties', companyId: 'aldar',
    title: '15% Off Yas Island Residences',
    description: 'Exclusive employee pricing on selected Yas Island residential units. Flexible payment plans available.',
    value: '15% Employee Discount', category: 'Property',
    color: '#C8973A', expires: 'Dec 31, 2024', featured: true,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=280&fit=crop',
    relevantFor: ['ihc', 'aldar', 'shory', 'purehealth', 'easylease'],
  },
  {
    id: 'off002', company: 'Shory', companyId: 'shory',
    title: 'Comprehensive Motor Insurance',
    description: 'Group employee rate on full comprehensive motor insurance. Instant approval, digital policy.',
    value: 'From AED 799/year', category: 'Insurance',
    color: '#0D9488', expires: 'Nov 30, 2024', featured: true,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=280&fit=crop',
    relevantFor: ['ihc', 'aldar', 'shory', 'purehealth', 'easylease', 'ghitha', 'palms'],
  },
  {
    id: 'off003', company: 'PureHealth', companyId: 'purehealth',
    title: 'Platinum Health Package',
    description: 'Annual health check including cardiac, diabetes, and cancer screening markers.',
    value: 'AED 299 (Reg. AED 1,200)', category: 'Healthcare',
    color: '#059669', expires: 'Oct 31, 2024', featured: false,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=280&fit=crop',
    relevantFor: ['ihc', 'aldar', 'shory', 'purehealth', 'easylease', 'ghitha', 'palms'],
  },
  {
    id: 'off004', company: 'EasyLease', companyId: 'easylease',
    title: 'Employee Vehicle Leasing',
    description: 'Competitive monthly leasing rates for IHC group employees. All models available.',
    value: 'From AED 1,299/month', category: 'Mobility',
    color: '#7C3AED', expires: 'Ongoing', featured: false,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=280&fit=crop',
    relevantFor: ['ihc', 'aldar', 'shory', 'purehealth', 'easylease', 'ghitha', 'palms'],
  },
  {
    id: 'off005', company: 'Palms Sports', companyId: 'palms',
    title: 'Sports & Fitness Membership',
    description: 'Access to all Palms Sports facilities including gym, pool, and courts across UAE.',
    value: 'AED 150/month', category: 'Wellness',
    color: '#EA580C', expires: 'Ongoing', featured: false,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=280&fit=crop',
    relevantFor: ['ihc', 'aldar', 'shory', 'purehealth', 'easylease', 'ghitha', 'palms'],
  },
  {
    id: 'off006', company: 'Ghitha', companyId: 'ghitha',
    title: 'Corporate Meal Plans',
    description: 'Subsidized meal plans for employees across all IHC office cafeterias.',
    value: '25% Subsidy', category: 'Food & Dining',
    color: '#DC2626', expires: 'Ongoing', featured: false,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=280&fit=crop',
    relevantFor: ['ihc', 'aldar', 'shory', 'purehealth', 'easylease', 'ghitha', 'palms'],
  },
];

export const MARKETPLACE_LISTINGS = [
  {
    id: 'mk001', title: '2021 Nissan Patrol Platinum', category: 'Cars',
    price: 'AED 185,000', seller: 'Mohammed A.', sellerCompany: 'Aldar Properties',
    condition: 'Excellent', posted: '2 days ago', featured: true,
    description: '2021 Nissan Patrol Platinum, white, 42,000 km. Full service history, single owner.',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=500&h=320&fit=crop',
    specs: { year: '2021', km: '42,000 km', color: 'White', fuel: 'Petrol' },
  },
  {
    id: 'mk002', title: 'Yas Island 2BR Apartment — Rent', category: 'Property',
    price: 'AED 90,000/yr', seller: 'Fatima K.', sellerCompany: 'IHC Group',
    condition: 'New', posted: '1 day ago', featured: true,
    description: 'Beautiful 2-bedroom apartment at Yas Island, fully furnished, sea view, parking included.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=320&fit=crop',
    specs: { type: 'Apartment', bedrooms: '2 BR', area: '1,240 sqft', floor: '14th Floor' },
  },
  {
    id: 'mk003', title: 'iPhone 15 Pro Max 256GB', category: 'Electronics',
    price: 'AED 3,800', seller: 'Ahmed R.', sellerCompany: 'Shory',
    condition: 'Like New', posted: '3 days ago', featured: false,
    description: 'iPhone 15 Pro Max 256GB Natural Titanium. Used 6 months, comes with box and accessories.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=320&fit=crop',
    specs: { storage: '256GB', color: 'Natural Titanium', warranty: '6 months left', accessories: 'Full box' },
  },
  {
    id: 'mk004', title: 'L-Shaped Grey Sofa Set', category: 'Furniture',
    price: 'AED 2,200', seller: 'Layla S.', sellerCompany: 'PureHealth',
    condition: 'Good', posted: '5 days ago', featured: false,
    description: 'Premium L-shaped sofa, light grey, seats 6. Bought from Pan Emirates 2 years ago.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=320&fit=crop',
    specs: { material: 'Fabric', color: 'Light Grey', size: '3m x 2m', seats: '6 persons' },
  },
  {
    id: 'mk005', title: 'Samsung 65" QLED TV', category: 'Electronics',
    price: 'AED 2,500', seller: 'Omar H.', sellerCompany: 'EasyLease',
    condition: 'Excellent', posted: '1 week ago', featured: false,
    description: 'Samsung 65" QLED 4K Smart TV. Moving abroad, must sell quickly.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=320&fit=crop',
    specs: { size: '65 inch', type: 'QLED 4K', year: '2023', smart: 'Yes' },
  },
  {
    id: 'mk006', title: '2022 Toyota Land Cruiser', category: 'Cars',
    price: 'AED 310,000', seller: 'Hassan M.', sellerCompany: 'IHC Group',
    condition: 'Excellent', posted: '4 days ago', featured: false,
    description: '2022 Land Cruiser VX.R, black, 28,000 km, agency warranty until 2027.',
    image: 'https://images.unsplash.com/photo-1625231334168-29488c4c2a55?w=500&h=320&fit=crop',
    specs: { year: '2022', km: '28,000 km', color: 'Black', fuel: 'Petrol' },
  },
];

export const SERVICES = [
  { id: 'srv001', title: 'Salary Certificate', icon: 'FileText', description: 'Request official salary certificate', time: '1-2 business days', category: 'HR Documents' },
  { id: 'srv002', title: 'Leave Portal', icon: 'Calendar', description: 'Apply for annual or emergency leave', time: 'Instant', category: 'Leave Management' },
  { id: 'srv003', title: 'HR Contact', icon: 'Users', description: 'Connect with your HR business partner', time: 'Same day', category: 'HR Support' },
  { id: 'srv004', title: 'Policy Center', icon: 'BookOpen', description: 'Access company policies and guidelines', time: 'Instant', category: 'Compliance' },
  { id: 'srv005', title: 'IT Support', icon: 'Monitor', description: 'Raise IT tickets and track requests', time: '4-8 hours', category: 'IT Services' },
  { id: 'srv006', title: 'Benefits Management', icon: 'Shield', description: 'View and manage your employee benefits', time: 'Instant', category: 'Benefits' },
  { id: 'srv007', title: 'Training & Learning', icon: 'GraduationCap', description: 'Access online learning and training library', time: 'Instant', category: 'Learning' },
  { id: 'srv008', title: 'Expense Claims', icon: 'Receipt', description: 'Submit and track expense reimbursements', time: '3-5 days', category: 'Finance' },
];

export const COLLEAGUES = [
  {
    id: 'col001', name: 'Ahmed Al Rashidi', company: 'IHC Group', title: 'Chief Strategy Officer',
    avatar: 'AR', online: true, lastMessage: 'Let\'s sync on the Q4 plan',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'col002', name: 'Maryam Jaber', company: 'Aldar Properties', title: 'Head of Leasing',
    avatar: 'MJ', online: true, lastMessage: 'The Yas units are ready',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'col003', name: 'Faris Al Nuaimi', company: 'Shory', title: 'Engineering Lead',
    avatar: 'FN', online: false, lastMessage: 'API docs updated ✓',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'col004', name: 'Hind Al Shamsi', company: 'PureHealth', title: 'Medical Director',
    avatar: 'HS', online: false, lastMessage: 'Screening slots confirmed',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'col005', name: 'Saif Khalifa', company: 'EasyLease', title: 'Fleet Manager',
    avatar: 'SK', online: true, lastMessage: 'New Hyundai models arrived',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
];

export const MARKET_DATA = {
  ticker: 'IHC',
  exchange: 'ADX',
  price: 328.50,
  change: +4.20,
  changePct: +1.30,
  marketCap: 'AED 2.4T',
  volume: '1.2M',
  high52w: 341.00,
  low52w: 198.40,
  chartData: [
    { day: 'Mon', price: 320 }, { day: 'Tue', price: 315 }, { day: 'Wed', price: 322 },
    { day: 'Thu', price: 318 }, { day: 'Fri', price: 324 }, { day: 'Sat', price: 328.5 },
  ],
};
