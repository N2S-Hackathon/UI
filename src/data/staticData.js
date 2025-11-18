// Static data moved to separate module for better code organization and performance
export const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'Basic 100 Mbps',
    description: 'Perfect for light browsing and streaming',
    speed: '100 Mbps',
    price: 39.99,
    type: 'Residential',
    features: ['Up to 100 Mbps', 'Unlimited data', 'Free installation', '24/7 support'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Fiber 500 Mbps',
    description: 'High-speed internet for families',
    speed: '500 Mbps',
    price: 59.99,
    type: 'Residential',
    features: ['Up to 500 Mbps', 'Unlimited data', 'Free WiFi router', 'Priority support'],
    status: 'active'
  },
  {
    id: 3,
    name: 'Fiber 1 Gbps',
    description: 'Ultimate speed for power users',
    speed: '1 Gbps',
    price: 79.99,
    type: 'Residential',
    features: ['Up to 1 Gbps', 'Unlimited data', 'Premium WiFi 6 router', 'VIP support'],
    status: 'active'
  },
  {
    id: 4,
    name: 'Business Pro',
    description: 'Reliable connectivity for small businesses',
    speed: '500 Mbps',
    price: 99.99,
    type: 'Business',
    features: ['Up to 500 Mbps', 'Static IP address', 'Business-grade support', 'SLA guarantee'],
    status: 'active'
  },
  {
    id: 5,
    name: 'Enterprise',
    description: 'Enterprise-grade internet solution',
    speed: '1 Gbps+',
    price: 199.99,
    type: 'Business',
    features: ['Custom bandwidth', 'Dedicated fiber', 'Enterprise support', '99.9% uptime SLA'],
    status: 'active'
  },
  {
    id: 6,
    name: 'Premium Support',
    description: 'Enhanced support package for any plan',
    speed: 'N/A',
    price: 14.99,
    type: 'Add-on',
    features: ['Priority phone support', 'Same-day service', 'Remote diagnostics', 'Annual tech visit'],
    status: 'active'
  }
];

export const COHORTS_DATA = [
  {
    id: 1,
    name: 'New Customers',
    estimatedPeople: 2450,
    description: 'Customers who signed up in the last 90 days',
    zipCodes: [
      { zip: '10001', prospectCustomers: 450, existingCustomers: 320 },
      { zip: '10002', prospectCustomers: 380, existingCustomers: 290 },
      { zip: '10003', prospectCustomers: 520, existingCustomers: 340 },
      { zip: '10010', prospectCustomers: 150, existingCustomers: 0 }
    ]
  },
  {
    id: 2,
    name: 'Existing Customers',
    estimatedPeople: 8920,
    description: 'Active customers beyond initial 90-day period',
    zipCodes: [
      { zip: '10002', prospectCustomers: 120, existingCustomers: 1840 },
      { zip: '10003', prospectCustomers: 95, existingCustomers: 1650 },
      { zip: '10004', prospectCustomers: 180, existingCustomers: 2120 },
      { zip: '10005', prospectCustomers: 210, existingCustomers: 1890 },
      { zip: '10006', prospectCustomers: 85, existingCustomers: 730 }
    ]
  },
  {
    id: 3,
    name: 'First-time Subscribers',
    estimatedPeople: 1580,
    description: 'Never subscribed to any ISP service before',
    zipCodes: [
      { zip: '10003', prospectCustomers: 890, existingCustomers: 0 },
      { zip: '10011', prospectCustomers: 520, existingCustomers: 0 },
      { zip: '10012', prospectCustomers: 170, existingCustomers: 0 }
    ]
  },
  {
    id: 4,
    name: 'Long-term Customers',
    estimatedPeople: 5340,
    description: 'Loyal customers with 2+ years of service',
    zipCodes: [
      { zip: '10004', prospectCustomers: 45, existingCustomers: 1890 },
      { zip: '10005', prospectCustomers: 30, existingCustomers: 1560 },
      { zip: '10007', prospectCustomers: 55, existingCustomers: 1760 }
    ]
  },
  {
    id: 5,
    name: 'High-Value Segment',
    estimatedPeople: 1120,
    description: 'Premium tier customers with high usage',
    zipCodes: [
      { zip: '10005', prospectCustomers: 180, existingCustomers: 420 },
      { zip: '10022', prospectCustomers: 210, existingCustomers: 310 }
    ]
  },
  {
    id: 6,
    name: 'At-Risk Customers',
    estimatedPeople: 890,
    description: 'Customers showing signs of churn',
    zipCodes: [
      { zip: '10006', prospectCustomers: 45, existingCustomers: 320 },
      { zip: '10009', prospectCustomers: 60, existingCustomers: 280 },
      { zip: '10014', prospectCustomers: 35, existingCustomers: 150 }
    ]
  },
  {
    id: 7,
    name: 'Rural Area Residents',
    estimatedPeople: 3240,
    description: 'Customers in rural zip codes',
    zipCodes: [
      { zip: '10507', prospectCustomers: 420, existingCustomers: 580 },
      { zip: '10520', prospectCustomers: 380, existingCustomers: 490 },
      { zip: '10535', prospectCustomers: 310, existingCustomers: 440 },
      { zip: '10548', prospectCustomers: 290, existingCustomers: 330 }
    ]
  },
  {
    id: 8,
    name: 'Urban Professionals',
    estimatedPeople: 4670,
    description: 'Business district residents and professionals',
    zipCodes: [
      { zip: '10008', prospectCustomers: 620, existingCustomers: 890 },
      { zip: '10016', prospectCustomers: 580, existingCustomers: 810 },
      { zip: '10017', prospectCustomers: 540, existingCustomers: 760 },
      { zip: '10018', prospectCustomers: 490, existingCustomers: 680 },
      { zip: '10019', prospectCustomers: 300, existingCustomers: 0 }
    ]
  }
];

export const PROMOTIONS_DATA = [
  {
    id: 1,
    name: 'Summer Speed Boost',
    status: 'active',
    startDate: 'Nov 1, 2025',
    endDate: 'Dec 31, 2025',
    discount: 25,
    products: ['Fiber 500 Mbps', 'Fiber 1 Gbps', 'Business Pro'],
    cohort: 'New Customers'
  },
  {
    id: 2,
    name: 'New Customer Welcome',
    status: 'active',
    startDate: 'Oct 15, 2025',
    endDate: 'Jan 15, 2026',
    discount: 30,
    products: ['Basic 100 Mbps', 'Fiber 500 Mbps'],
    cohort: 'First-time Subscribers'
  },
  {
    id: 3,
    name: 'Loyalty Rewards',
    status: 'scheduled',
    startDate: 'Dec 1, 2025',
    endDate: 'Mar 31, 2026',
    discount: 20,
    products: ['Fiber 1 Gbps', 'Business Pro', 'Enterprise'],
    cohort: 'Long-term Customers'
  },
  {
    id: 4,
    name: 'Black Friday Special',
    status: 'active',
    startDate: 'Nov 15, 2025',
    endDate: 'Nov 30, 2025',
    discount: 40,
    products: ['Fiber 500 Mbps', 'Fiber 1 Gbps'],
    cohort: 'All Customers'
  },
  {
    id: 5,
    name: 'Holiday Bundle Deal',
    status: 'active',
    startDate: 'Nov 10, 2025',
    endDate: 'Dec 15, 2025',
    discount: 35,
    products: ['Fiber 1 Gbps', 'Business Pro', 'Premium Support'],
    cohort: 'Existing Customers'
  }
];

