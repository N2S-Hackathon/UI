# API Configuration Guide

## Current Configuration

The application is configured to use the live API at `https://barbie-euplastic-gibbously.ngrok-free.dev` with Basic Authentication.

### Authentication
- **Username:** `noise2signal`
- **Password:** `zestyIsAOK`

All API requests include Basic Auth headers automatically.

## Changing the API URL

You can configure the API URL in two ways:

### Option 1: Environment Variable (Recommended)

Create a `.env.local` file in the project root with:

```
VITE_API_URL=https://barbie-euplastic-gibbously.ngrok-free.dev
```

**Note:** 
- Vite uses `VITE_` prefix for environment variables (not `REACT_APP_`)
- After changing environment variables, you must restart the development server

### Option 2: Code Configuration

Edit `src/services/api.js` and change the default API URL:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-api-url';
```

**Note:** If you change the API URL, ensure authentication credentials match the new endpoint.

## Common API URLs

- **Production (ngrok):** `https://barbie-euplastic-gibbously.ngrok-free.dev`
- **Direct IP (legacy):** `http://3.136.171.60`
- **Local Development:** `http://localhost:8000`
- **Swagger Docs:** `https://barbie-euplastic-gibbously.ngrok-free.dev/docs`

## API Endpoints

The application uses the following endpoints:

### Data Management
- `GET /product` - Fetch all products with rate schedules
- `GET /cohort-list` - Fetch all customer cohorts (summary)
- `GET /cohort-list/{cohort_id}` - Fetch detailed cohort with zipcodes
- `GET /promotion` - Fetch all promotions

### Agentic Conversation (Claude Integration)
- `POST /conversation` - Create new conversation with initial prompt
  - Body: `{ "context_path": string, "prompt": string }`
  - Returns: `{ "conversation_id": uuid, "turn_id": uuid, "created_at": datetime }`
- `GET /conversation` - Get active conversation with all turns
  - Query: `?last_turn_seen` (optional, for polling new turns)
- `GET /conversation/{conversation_id}` - Get specific conversation by ID

**Usage Example:**
```javascript
import { createConversation, getActiveConversation } from './services/api';

// Start a conversation
const conv = await createConversation('promotions', 'Create a Black Friday promotion');

// Poll for updates
const conversation = await getActiveConversation();
```

## Fallback Behavior

If the API is unavailable or returns an error, the application will automatically fall back to mock data stored in `src/data/staticData.js`. This ensures the UI remains functional even without API connectivity.

## Testing API Connection

Open the browser console when loading the dashboard to see:
- Successful API calls (no errors)
- API connection errors (will show "Failed to fetch..." messages)
- Fallback to mock data notifications

## Data Transformation

The API responses are automatically transformed to match the UI's expected format:

### Products
- `productid` → `id`
- `productname` → `name`
- `productspeed` → `speed` (formatted as "X Mbps")
- Active rate extracted from `rates` array

### Cohorts
- `cohort_id` → `id`
- `cohort_name` → `name`
- `zipcode_count` → `estimatedPeople`

### Promotions
- `promotionid` → `id`
- `promotionname` → `name`
- Status calculated from `startdate` and `enddate`
- Dates formatted from ISO 8601 to "Mon DD, YYYY"

