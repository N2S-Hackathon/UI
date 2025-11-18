# API Integration Guide

This document explains how to connect the Zesty ISP dashboard to your backend API/database.

## Current Setup

The application is currently using **mock data** with simulated API delays to mimic real database calls. All data fetching is centralized in the `src/services/api.js` file.

## Data Entities

The application manages three main data entities:

### 1. Products
- **Fields**: `id`, `name`, `description`, `speed`, `price`, `type`, `features`, `status`
- **Used in**: Products tab, Product selection in promotion creation

### 2. Cohorts
- **Fields**: `id`, `name`, `zip`, `estimatedPeople`, `description`
- **Used in**: Cohorts tab, Cohort selection in promotion creation

### 3. Promotions
- **Fields**: `id`, `name`, `status`, `startDate`, `endDate`, `discount`, `products`, `cohort`, `revenueImpact`, `conversionRate`
- **Used in**: Promotion Management tab

## How to Connect Your API

### Step 1: Set the API Base URL

Create a `.env` file in the root of your project:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

If not set, it defaults to `http://localhost:3001/api`

### Step 2: Update the API Service

Open `src/services/api.js` and replace the mock implementations with real API calls.

#### Example: Fetch Products

**Current (Mock):**
```javascript
export const fetchProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([/* mock data */]);
    }, 300);
  });
};
```

**Replace with:**
```javascript
export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
};
```

### Step 3: API Endpoints Expected

Your backend should implement the following endpoints:

#### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

#### Cohorts
- `GET /api/cohorts` - Fetch all cohorts

#### Promotions
- `GET /api/promotions` - Fetch all promotions
- `POST /api/promotions` - Create a new promotion
- `PUT /api/promotions/:id` - Update a promotion
- `DELETE /api/promotions/:id` - Delete a promotion

## Expected Data Formats

### Product Object
```json
{
  "id": 1,
  "name": "Fiber 500 Mbps",
  "description": "High-speed internet for families",
  "speed": "500 Mbps",
  "price": 59.99,
  "type": "Residential",
  "features": ["Up to 500 Mbps", "Unlimited data", "Free WiFi router", "Priority support"],
  "status": "active"
}
```

### Cohort Object
```json
{
  "id": 1,
  "name": "New Customers",
  "zip": "10001",
  "estimatedPeople": 2450,
  "description": "Customers who signed up in the last 90 days"
}
```

### Promotion Object
```json
{
  "id": 1,
  "name": "Summer Speed Boost",
  "status": "active",
  "startDate": "Nov 1, 2025",
  "endDate": "Dec 31, 2025",
  "discount": 25,
  "products": ["Fiber 500 Mbps", "Fiber 1 Gbps", "Business Pro"],
  "cohort": "New Customers",
  "revenueImpact": "$18.5K",
  "conversionRate": "72%"
}
```

## Authentication

If your API requires authentication, update the fetch calls to include headers:

```javascript
export const fetchProducts = async () => {
  const token = localStorage.getItem('authToken'); // or however you store tokens
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
};
```

## Error Handling

The Dashboard component has basic error handling in place. Enhance it as needed:

```javascript
// In Dashboard.jsx
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, cohortsData, promotionsData] = await Promise.all([
        fetchProducts(),
        fetchCohorts(),
        fetchPromotions()
      ]);
      setProducts(productsData);
      setCohorts(cohortsData);
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Add user-facing error notification here
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
```

## Testing the Integration

1. **Start your backend server** with the expected endpoints
2. **Update the `.env` file** with your API URL
3. **Restart the React development server** (`npm run dev`)
4. **Check the browser console** for any API errors
5. **Verify data loads** in each tab (Promotions, Cohorts, Products)

## CORS Configuration

If your API is on a different domain, ensure CORS is properly configured on your backend:

```javascript
// Example Express.js CORS setup
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true
}));
```

## Next Steps

Once the API is connected:
1. Implement actual create/update/delete functionality for promotions
2. Add real-time updates using WebSockets (optional)
3. Implement user authentication and authorization
4. Add error notifications/toasts for failed API calls
5. Implement data refresh mechanisms

## Questions?

For questions about the frontend implementation, refer to:
- `src/services/api.js` - All API call definitions
- `src/pages/Dashboard.jsx` - Main component using the API
- `DASHBOARD_COMPONENT_DIAGRAM.md` - UI structure reference

