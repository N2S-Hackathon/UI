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
        status: 'active', // Fallback status
        rates: product.rates || [] // Keep original rates for detailed view
      };
    });
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    // Fallback to mock data from staticData
    const { PRODUCTS_DATA } = await import('../data/staticData');
    return PRODUCTS_DATA;
  }
};

/**
 * Fetch a specific product by ID with its rate schedule
 * @param {number} productId - Product ID
 * @returns {Promise} Product details with rates
 */
export const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const product = await response.json();
    
    // Get the current/active rate
    const activeRate = product.rates && product.rates.length > 0
      ? product.rates
          .filter(r => !r.enddate || new Date(r.enddate) > new Date())
          .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0]
      : null;
    
    return {
      id: product.productid,
      name: product.productname,
      description: `${product.producttype} internet service`,
      speed: product.productspeed ? `${product.productspeed} Mbps` : 'N/A',
      price: activeRate ? parseFloat(activeRate.price) : 0,
      type: product.producttype,
      features: [],
      status: 'active',
      rates: product.rates || []
    };
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    throw error;
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
    // API returns: cohort_name, cohort_id, zipcode_count, description, created_at
    return apiCohorts.map(cohort => ({
      id: cohort.cohort_id,
      name: cohort.cohort_name,
      estimatedPeople: cohort.zipcode_count || 0,
      description: cohort.description || 'Customer cohort',
      createdAt: cohort.created_at,
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
    // API returns PromotionWithStagingResponse: { promotion: {...}, staging_records: [...] }
    // Note: products array is enriched in Dashboard component by looking up productId
    return apiPromotions.map(item => {
      // Extract the nested promotion object
      const promo = item.promotion || item;
      const stagingRecords = item.staging_records || [];
      
      // Check if this is a staging-only (new) promotion
      const isStagingOnly = item.promotion === null && stagingRecords.length > 0;
      
      // Use staging record data for display if promotion is null
      const displayData = isStagingOnly ? stagingRecords[0] : promo;
      
      // Check for pending staging records
      const hasPendingChanges = isStagingOnly || stagingRecords.some(sr => sr.stagingstatus === 'pending');
      
      const status = calculatePromotionStatus(displayData.startdate, displayData.enddate);
      
      // Calculate discount from price/discountamount if available
      let discount = 0;
      if (displayData.discountamount) {
        discount = parseFloat(displayData.discountamount);
      }
      
      return {
        id: isStagingOnly ? displayData.stagingid : promo.promotionid,
        name: displayData.promotionname,
        status: status,
        startDate: formatDate(displayData.startdate),
        endDate: formatDate(displayData.enddate),
        discount: discount,
        products: [], // Enriched in Dashboard by looking up productId from products list
        cohort: displayData.cohortlistid || 'All Customers', // Using cohort ID or fallback
        action: displayData.action,
        productId: displayData.productid,
        price: displayData.price ? parseFloat(displayData.price) : null,
        term: displayData.term,
        limitByZip: displayData.limitbyzip,
        limitByState: displayData.limitbystate,
        // Staging records support
        isStagingOnly: isStagingOnly,
        hasPendingChanges: hasPendingChanges,
        stagingRecords: isStagingOnly ? [] : stagingRecords.map(sr => ({
          stagingId: sr.stagingid,
          conversationId: sr.conversationid,
          status: sr.stagingstatus,
          createdOn: sr.createdon,
          promotionName: sr.promotionname,
          startDate: formatDate(sr.startdate),
          endDate: formatDate(sr.enddate),
          cohortListId: sr.cohortlistid,
          action: sr.action,
          productId: sr.productid,
          price: sr.price ? parseFloat(sr.price) : null,
          discountAmount: sr.discountamount ? parseFloat(sr.discountamount) : null,
          term: sr.term
        }))
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

/**
 * Commit all pending staging records to production promotion table
 * This is a non-agentic administrative endpoint
 * @returns {Promise} Success response (204 No Content)
 */
export const commitStagedPromotions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/promotion/promotions-commit`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to commit staged promotions:', error);
    throw error;
  }
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
 * @param {string} lastStepIdSeen - Optional: last step UUID seen (for polling new steps)
 * @returns {Promise} Full conversation with turns
 */
export const getActiveConversation = async (lastStepIdSeen = null) => {
  try {
    const url = lastStepIdSeen 
      ? `${API_BASE_URL}/conversation?last_step_id_seen=${lastStepIdSeen}`
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
        status: turn.status,
        assistantResponse: turn.assistant_response,
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
        status: turn.status,
        assistantResponse: turn.assistant_response,
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
    console.error('Failed to fetch conversation by ID:', error);
    throw error;
  }
};

/**
 * Add a new turn to an existing conversation
 * @param {string} conversationId - Conversation UUID
 * @param {string} prompt - User message for the new turn
 * @param {boolean} force - Optional: force override if previous turn is stale (1-10 min old)
 * @returns {Promise} Turn creation response with turn_id
 */
export const addConversationTurn = async (conversationId, prompt, force = false) => {
  try {
    const url = force 
      ? `${API_BASE_URL}/conversation/${conversationId}/turn?force=true`
      : `${API_BASE_URL}/conversation/${conversationId}/turn`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Previous turn is still processing. Please wait or use force=true if stale.');
      }
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      conversationId: data.conversation_id,
      turnId: data.turn_id,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Failed to add conversation turn:', error);
    throw error;
  }
};

/**
 * Get detailed cohort information including all zipcodes
 * @param {string} cohortId - Cohort UUID
 * @returns {Promise} Detailed cohort with zipcodes
 */
export const fetchCohortById = async (cohortId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cohort-list/${cohortId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const cohort = await response.json();
    
    // Transform API data to match UI structure
    return {
      id: cohort.cohort_id,
      name: cohort.cohort_name,
      description: cohort.description,
      createdAt: cohort.created_at,
      zipCodes: cohort.zipcodes.map(z => ({
        zipcode: z.zipcode,
        associated: z.associated
      })),
      estimatedPeople: cohort.zipcodes.length
    };
  } catch (error) {
    console.error('Failed to fetch cohort details:', error);
    throw error;
  }
};

