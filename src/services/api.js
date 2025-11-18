// API Service - Ready for database connection
// Replace the mock data with actual API calls when backend is ready

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// ====================
// PRODUCTS API
// ====================

export const fetchProducts = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/products`);
  // return await response.json();
  
  // Mock data - replace when backend is ready
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
      ]);
    }, 300);
  });
};

export const createProduct = async (productData) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/products`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(productData)
  // });
  // return await response.json();
  
  console.log('Create product:', productData);
  return { success: true, id: Date.now() };
};

export const updateProduct = async (productId, productData) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(productData)
  // });
  // return await response.json();
  
  console.log('Update product:', productId, productData);
  return { success: true };
};

export const deleteProduct = async (productId) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
  //   method: 'DELETE'
  // });
  // return await response.json();
  
  console.log('Delete product:', productId);
  return { success: true };
};

// ====================
// COHORTS API
// ====================

export const fetchCohorts = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/cohorts`);
  // return await response.json();
  
  // Mock data - replace when backend is ready
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'New Customers',
          zip: '10001',
          estimatedPeople: 2450,
          description: 'Customers who signed up in the last 90 days'
        },
        {
          id: 2,
          name: 'Existing Customers',
          zip: '10002',
          estimatedPeople: 8920,
          description: 'Active customers beyond initial 90-day period'
        },
        {
          id: 3,
          name: 'First-time Subscribers',
          zip: '10003',
          estimatedPeople: 1580,
          description: 'Never subscribed to any ISP service before'
        },
        {
          id: 4,
          name: 'Long-term Customers',
          zip: '10004',
          estimatedPeople: 5340,
          description: 'Loyal customers with 2+ years of service'
        },
        {
          id: 5,
          name: 'High-Value Segment',
          zip: '10005',
          estimatedPeople: 1120,
          description: 'Premium tier customers with high usage'
        },
        {
          id: 6,
          name: 'At-Risk Customers',
          zip: '10006',
          estimatedPeople: 890,
          description: 'Customers showing signs of churn'
        },
        {
          id: 7,
          name: 'Rural Area Residents',
          zip: '10007',
          estimatedPeople: 3240,
          description: 'Customers in rural zip codes'
        },
        {
          id: 8,
          name: 'Urban Professionals',
          zip: '10008',
          estimatedPeople: 4670,
          description: 'Business district residents and professionals'
        }
      ]);
    }, 300);
  });
};

// ====================
// PROMOTIONS API
// ====================

export const fetchPromotions = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/promotions`);
  // return await response.json();
  
  // Mock data - replace when backend is ready
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Summer Speed Boost',
          status: 'active',
          startDate: 'Nov 1, 2025',
          endDate: 'Dec 31, 2025',
          discount: 25,
          products: ['Fiber 500 Mbps', 'Fiber 1 Gbps', 'Business Pro'],
          cohort: 'New Customers',
          revenueImpact: '$18.5K',
          conversionRate: '72%'
        },
        {
          id: 2,
          name: 'New Customer Welcome',
          status: 'active',
          startDate: 'Oct 15, 2025',
          endDate: 'Jan 15, 2026',
          discount: 30,
          products: ['Basic 100 Mbps', 'Fiber 500 Mbps'],
          cohort: 'First-time Subscribers',
          revenueImpact: '$15.8K',
          conversionRate: '68%'
        },
        {
          id: 3,
          name: 'Loyalty Rewards',
          status: 'scheduled',
          startDate: 'Dec 1, 2025',
          endDate: 'Mar 31, 2026',
          discount: 20,
          products: ['Fiber 1 Gbps', 'Business Pro', 'Enterprise'],
          cohort: 'Long-term Customers',
          revenueImpact: null,
          conversionRate: null
        },
        {
          id: 4,
          name: 'Black Friday Special',
          status: 'active',
          startDate: 'Nov 15, 2025',
          endDate: 'Nov 30, 2025',
          discount: 40,
          products: ['Fiber 500 Mbps', 'Fiber 1 Gbps'],
          cohort: 'All Customers',
          revenueImpact: '$22.3K',
          conversionRate: '85%'
        },
        {
          id: 5,
          name: 'Holiday Bundle Deal',
          status: 'active',
          startDate: 'Nov 10, 2025',
          endDate: 'Dec 15, 2025',
          discount: 35,
          products: ['Fiber 1 Gbps', 'Business Pro', 'Premium Support'],
          cohort: 'Existing Customers',
          revenueImpact: '$19.7K',
          conversionRate: '74%'
        }
      ]);
    }, 300);
  });
};

export const createPromotion = async (promotionData) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/promotions`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(promotionData)
  // });
  // return await response.json();
  
  console.log('Create promotion:', promotionData);
  return { success: true, id: Date.now() };
};

export const updatePromotion = async (promotionId, promotionData) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/promotions/${promotionId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(promotionData)
  // });
  // return await response.json();
  
  console.log('Update promotion:', promotionId, promotionData);
  return { success: true };
};

export const deletePromotion = async (promotionId) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/promotions/${promotionId}`, {
  //   method: 'DELETE'
  // });
  // return await response.json();
  
  console.log('Delete promotion:', promotionId);
  return { success: true };
};

