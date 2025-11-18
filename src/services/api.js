// API Service - Live API Integration
// Fetches data from backend API with fallback to mock data

// Use proxy in development to avoid CORS issues, direct URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Authentication credentials (handled by Vite proxy in development)
const API_USERNAME = 'noise2signal';
const API_PASSWORD = 'zestyIsAOK';

// Helper function to create auth headers
// Note: In development, auth is handled by Vite proxy. This is for production builds.
const getAuthHeaders = () => {
  // Check if we're using the proxy (development)
  const usingProxy = API_BASE_URL.startsWith('/api');
  
  if (usingProxy) {
    // Proxy handles auth, just send content type
    return {
      'Content-Type': 'application/json'
    };
  } else {
    // Direct API call (production), include auth headers
    const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    };
  }
};

// Utility functions for data transformation
const formatDate = (isoDateString) => {
  if (!isoDateString) return null;
  const date = new Date(isoDateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const calculatePromotionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  if (now < start) return 'scheduled';
  if (end && now > end) return 'expired';
  return 'active';
};

// ====================
// PRODUCTS API
// ====================

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/product`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const apiProducts = await response.json();
    
    // Transform API data to match UI structure
    return apiProducts.map(product => {
      // Get the current/active rate (most recent with no end date or latest start date)
      const activeRate = product.rates && product.rates.length > 0
        ? product.rates
            .filter(r => !r.enddate || new Date(r.enddate) > new Date())
            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0]
        : null;
      
      return {
        id: product.productid,
        name: product.productname,
        description: `${product.producttype} internet service`, // Fallback description
        speed: product.productspeed ? `${product.productspeed} Mbps` : 'N/A',
        price: activeRate ? parseFloat(activeRate.price) : 0,
        type: product.producttype,
        features: [], // Not in API, using empty array
        status: 'active' // Fallback status
      };
    });
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    // Fallback to mock data from staticData
    const { PRODUCTS_DATA } = await import('../data/staticData');
    return PRODUCTS_DATA;
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/cohort-list`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const apiCohorts = await response.json();
    
    // Transform API data to match UI structure
    return apiCohorts.map(cohort => ({
      id: cohort.cohort_id,
      name: cohort.cohort_name,
      estimatedPeople: cohort.zipcode_count || 0,
      description: cohort.description || 'Customer cohort',
      zipCodes: [] // Summary endpoint doesn't include zipcodes, fetch detail if needed
    }));
  } catch (error) {
    console.error('Failed to fetch cohorts from API:', error);
    // Fallback to mock data from staticData
    const { COHORTS_DATA } = await import('../data/staticData');
    return COHORTS_DATA;
  }
};

// ====================
// PROMOTIONS API
// ====================

export const fetchPromotions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/promotion`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const apiPromotions = await response.json();
    
    // Transform API data to match UI structure
    return apiPromotions.map(promo => {
      const status = calculatePromotionStatus(promo.startdate, promo.enddate);
      
      // Calculate discount from price/discountamount if available
      let discount = 0;
      if (promo.discountamount) {
        discount = parseFloat(promo.discountamount);
      }
      
      return {
        id: promo.promotionid,
        name: promo.promotionname,
        status: status,
        startDate: formatDate(promo.startdate),
        endDate: formatDate(promo.enddate),
        discount: discount,
        products: [], // Not directly in API, would need product lookup
        cohort: promo.cohortlistid || 'All Customers', // Using cohort ID or fallback
        action: promo.action,
        productId: promo.productid,
        price: promo.price ? parseFloat(promo.price) : null,
        term: promo.term,
        limitByZip: promo.limitbyzip,
        limitByState: promo.limitbystate
      };
    });
  } catch (error) {
    console.error('Failed to fetch promotions from API:', error);
    // Fallback to mock data from staticData
    const { PROMOTIONS_DATA } = await import('../data/staticData');
    return PROMOTIONS_DATA;
  }
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

// ====================
// CONVERSATION API (Agentic)
// ====================

/**
 * Create a new conversation with Claude and process initial prompt
 * @param {string} contextPath - Context path for the conversation
 * @param {string} prompt - Initial user prompt
 * @returns {Promise} Conversation creation response
 */
export const createConversation = async (contextPath, prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        context_path: contextPath,
        prompt: prompt
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      conversationId: data.conversation_id,
      turnId: data.turn_id,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw error;
  }
};

/**
 * Get the active conversation with all turns
 * @param {number} lastTurnSeen - Optional: last turn index seen (for polling)
 * @returns {Promise} Full conversation with turns
 */
export const getActiveConversation = async (lastTurnSeen = null) => {
  try {
    const url = lastTurnSeen !== null 
      ? `${API_BASE_URL}/conversation?last_turn_seen=${lastTurnSeen}`
      : `${API_BASE_URL}/conversation`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      conversationId: data.conversation_id,
      name: data.name,
      startedAt: data.started_at,
      turns: data.turns.map(turn => ({
        turnId: turn.turn_id,
        userMessage: turn.user_message,
        createdAt: turn.created_at,
        llmSteps: turn.llm_steps.map(step => ({
          stepId: step.step_id,
          stepType: step.step_type,
          input: step.input,
          output: step.output,
          createdAt: step.created_at
        }))
      }))
    };
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    throw error;
  }
};

/**
 * Get a specific conversation by ID
 * @param {string} conversationId - Conversation UUID
 * @returns {Promise} Conversation with turns
 */
export const getConversationById = async (conversationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      conversationId: data.conversation_id,
      name: data.name,
      startedAt: data.started_at,
      turns: data.turns.map(turn => ({
        turnId: turn.turn_id,
        userMessage: turn.user_message,
        createdAt: turn.created_at,
        llmSteps: turn.llm_steps
      }))
    };
  } catch (error) {
    console.error('Failed to fetch conversation by ID:', error);
    throw error;
  }
};

