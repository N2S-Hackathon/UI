# Conversation API Implementation - Complete Integration

## Overview
This document describes the complete implementation of the N2S Backend Conversation API integration with the Dashboard UI, following the **202 Accepted + Polling** pattern with real-time LLM step display.

## Architecture

### 1. Custom Hook: `useConversation.js`
**Purpose:** Centralized conversation state management with automatic polling

**Features:**
- ✅ Manages conversation lifecycle (start, add turn, reset)
- ✅ Automatic polling with 2-second intervals
- ✅ Efficient polling using `last_step_id_seen` parameter
- ✅ Time-based concurrency protection (1-minute cooldown)
- ✅ Automatic status tracking (idle, processing, completed)
- ✅ Error handling with user-friendly messages
- ✅ Cleanup on unmount (stops polling)

**API:**
```javascript
const {
  conversationId,      // Current conversation UUID
  turns,               // Array of conversation turns
  isProcessing,        // Boolean: is LLM processing?
  error,               // Error message (if any)
  status,              // 'idle' | 'processing' | 'pending' | 'completed'
  latestTurn,          // Most recent turn object
  timeSinceLastRequest, // Seconds since last request
  startConversation,   // Function: (contextPath, prompt) => Promise<boolean>
  addTurn,             // Function: (prompt, force?) => Promise<boolean>
  resetConversation,   // Function: () => void
  canSendMessage       // Boolean: can user send a message now?
} = useConversation();
```

### 2. Component: `LLMStepDisplay.jsx`
**Purpose:** Display LLM processing steps in real-time

**Features:**
- ✅ Maps step types to user-friendly labels and icons
- ✅ Shows processing indicator for active steps
- ✅ Displays step output (SQL queries, results, etc.)
- ✅ Timestamps for each step
- ✅ Visual highlighting for latest step

**Step Types Supported:**
- 💭 `generation` - Thinking
- 🔍 `sql_query` - Querying Database
- 📊 `sql_result` - Analyzing Results
- 🔧 `tool_use` - Using Tool
- 💬 `final_response` - Responding
- ⚙️ `default` - Processing (fallback)

### 3. Enhanced Component: `ChatSidebar.jsx`
**Purpose:** Display chat interface with conversation turns

**New Features:**
- ✅ Displays conversation turns with user messages
- ✅ Shows LLM steps in real-time
- ✅ Displays final assistant responses
- ✅ Error message display
- ✅ Processing status indicator
- ✅ Disabled input during processing
- ✅ Visual feedback for send button state

**New Props:**
```javascript
<ChatSidebar
  // Existing props
  isOpen={boolean}
  onToggle={function}
  messages={array}
  onSendMessage={function}
  isTyping={boolean}
  onCTAClick={function}
  
  // New conversation props
  conversationTurns={array}     // Array of turn objects from API
  isProcessing={boolean}         // Is LLM currently processing?
  canSendMessage={boolean}       // Can user send a message?
  error={string}                 // Error message to display
/>
```

### 4. Updated: `Dashboard.jsx`
**Purpose:** Integrate conversation hook with UI

**Changes:**
- ✅ Imports and initializes `useConversation` hook
- ✅ Updated `handleSendMessage` to use conversation API
- ✅ Determines new conversation vs. continuation
- ✅ Passes conversation state to ChatSidebar
- ✅ Error handling integrated

## Data Flow

### Starting a New Conversation

```
User types message
    ↓
handleSendMessage() called
    ↓
Check if new conversation needed
    ↓
conversation.startConversation(contextPath, message)
    ↓
POST /conversation (202 Accepted)
    ↓
Start polling (every 2 seconds)
    ↓
GET /conversation?last_step_id_seen={id}
    ↓
Updates turns state
    ↓
ChatSidebar displays LLM steps in real-time
    ↓
Turn status becomes 'completed'
    ↓
Stop polling
    ↓
Display final response
    ↓
Enable send button
```

### Adding a Turn (Follow-up)

```
User types follow-up message
    ↓
handleSendMessage() called
    ↓
Check conversation exists and is completed
    ↓
conversation.addTurn(message)
    ↓
POST /conversation/{id}/turn (202 Accepted)
    ↓
Start polling again
    ↓
... (same as above)
```

## Concurrency Protection

### Time-Based Blocking

| Time Since Last Request | Behavior | User Experience |
|------------------------|----------|-----------------|
| **< 60 seconds** | 🔴 Block new requests | Shows error: "Please wait X seconds" |
| **≥ 60 seconds** | 🟢 Allow new requests | Normal operation |

### Status-Based Blocking

| Turn Status | Can Add Turn? | Can Start New Conversation? |
|------------|---------------|----------------------------|
| `idle` | N/A | ✅ Yes |
| `pending` | ❌ No | ❌ No (< 60s) |
| `processing` | ❌ No | ❌ No (< 60s) |
| `completed` | ✅ Yes | ✅ Yes (if > 60s since last) |

## Error Handling

### Hook Level (useConversation.js)
- Catches API errors
- Sets `error` state with user-friendly messages
- Prevents infinite polling on errors
- Returns `false` on failure (doesn't throw)

### Component Level (ChatSidebar.jsx)
- Displays errors in red message bubble
- Shows warning icon (⚠️)
- Errors are dismissible (cleared on next successful request)

### Dashboard Level
- Logs errors to console for debugging
- Doesn't block UI on errors
- Allows retry after error

## Polling Strategy

### Efficient Polling
```javascript
// Initial poll (no last_step_id_seen)
GET /conversation
// Returns all turns and steps

// Subsequent polls (with last_step_id_seen)
GET /conversation?last_step_id_seen={uuid}
// Returns only NEW steps since last poll
```

### Polling Lifecycle
1. **Start:** When conversation/turn created (202 Accepted)
2. **Continue:** Every 2 seconds while `status !== 'completed'`
3. **Stop:** When turn status becomes `'completed'`
4. **Cleanup:** On component unmount (prevents memory leaks)

## UI States

### State 1: Idle
- ✅ Send button enabled
- ✅ Input enabled
- ✅ Placeholder: "Ask me anything..."
- 📊 Status: No conversation active

### State 2: Processing
- ❌ Send button disabled
- ❌ Input disabled
- 🔄 Processing indicator visible
- 📊 Status: "Processing..."
- 💭 LLM steps displaying in real-time

### State 3: Completed
- ✅ Send button enabled
- ✅ Input enabled
- ✅ Final response displayed
- 📊 Status: Ready for next turn

### State 4: Error
- ⚠️ Error message displayed
- ✅ Send button enabled (for retry)
- ✅ Input enabled
- 📊 Status: Error shown in red bubble

## Styling

### New CSS Classes
- `.llm-steps-container` - Container for LLM steps
- `.llm-step` - Individual step
- `.llm-step.latest` - Highlighted latest step
- `.step-header` - Step icon, label, and time
- `.step-output` - Step output content
- `.processing-indicator` - Animated spinner
- `.processing-status` - Status bar above input
- `.status-dot` - Pulsing status dot
- `.chat-message.error` - Error message styling

### Animations
- `spin` - Spinner rotation (1s linear infinite)
- `pulse` - Status dot pulsing (2s ease-in-out infinite)

## Testing Checklist

### ✅ Basic Flow
- [ ] Send first message → starts new conversation
- [ ] LLM steps display in real-time
- [ ] Final response shows when completed
- [ ] Send follow-up → adds turn to same conversation
- [ ] Multi-turn context is maintained

### ✅ Concurrency Protection
- [ ] Double-click sends only once
- [ ] Trying to send < 60s shows error
- [ ] Trying to send during processing shows error
- [ ] Can send after 60s cooldown

### ✅ Polling
- [ ] Polling starts after 202 Accepted
- [ ] Polling stops when turn completes
- [ ] Polling uses `last_step_id_seen` for efficiency
- [ ] No memory leaks (polling stops on unmount)

### ✅ Error Handling
- [ ] API errors display in UI
- [ ] 429 errors show helpful message
- [ ] 400 errors (turn still processing) handled
- [ ] Network errors don't crash app

### ✅ UI States
- [ ] Send button disabled during processing
- [ ] Input disabled during processing
- [ ] Processing indicator shows
- [ ] Error messages display correctly
- [ ] Status transitions smoothly

## Configuration

### Polling Interval
```javascript
// In useConversation.js
const POLL_INTERVAL = 2000; // 2 seconds
```

### Concurrency Timeout
```javascript
// In useConversation.js
const CONCURRENCY_TIMEOUT = 60; // 60 seconds
```

### Context Path
```javascript
// In Dashboard.jsx - handleSendMessage()
const contextPath = '/promotion-management';
```

## API Integration

### Endpoints Used
1. **POST /conversation** - Start new conversation
   - Request: `{ context_path, prompt }`
   - Response: `{ conversation_id, turn_id, created_at }`

2. **GET /conversation** - Poll for updates
   - Query: `?last_step_id_seen={uuid}` (optional)
   - Response: `{ conversation_id, name, started_at, turns[] }`

3. **POST /conversation/{id}/turn** - Add turn
   - Request: `{ prompt }`
   - Query: `?force=true` (optional)
   - Response: `{ conversation_id, turn_id, created_at }`

### Response Structure
```javascript
{
  conversation_id: "uuid",
  name: "Conversation Name",
  started_at: "2025-11-19T...",
  turns: [
    {
      turn_id: "uuid",
      user_message: "Create promotions...",
      status: "completed",  // or "pending", "processing"
      assistant_response: "I've created...",
      created_at: "2025-11-19T...",
      llm_steps: [
        {
          step_id: "uuid",
          step_type: "sql_query",
          input: "SELECT ...",
          output: "Query results...",
          created_at: "2025-11-19T..."
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Polling Doesn't Stop
**Symptom:** Continuous network requests after turn completes
**Cause:** Turn status not being set to 'completed' by backend
**Fix:** Check backend response, ensure status field is correct

### Steps Don't Display
**Symptom:** No LLM steps visible
**Cause:** Empty `llm_steps` array or wrong data structure
**Fix:** Check API response structure, verify step objects have required fields

### Can't Send Message
**Symptom:** Send button always disabled
**Cause:** `canSendMessage` stuck at false
**Fix:** Check turn status and timing logic in `useConversation`

### Error: "Please wait X seconds"
**Symptom:** Can't send message even though turn completed
**Cause:** Time-based concurrency protection active
**Fix:** Wait for cooldown period (60s from last request)

## Performance Optimizations

1. **Efficient Polling** - Uses `last_step_id_seen` to get only new data
2. **Auto-Stop** - Polling stops when turn completes
3. **Cleanup** - Intervals cleared on unmount
4. **Memoization** - Components use React.memo where appropriate
5. **Conditional Rendering** - LLM steps only render when present

## Future Enhancements

### Short Term
- [ ] Add "Force New Chat" button for stuck turns (1-10 min)
- [ ] Conversation history (list of past conversations)
- [ ] Export conversation as text/JSON
- [ ] Retry failed turns

### Medium Term
- [ ] WebSocket support (replace polling)
- [ ] Streaming responses (display text as it arrives)
- [ ] Rich formatting for step outputs (syntax highlighting)
- [ ] Voice input support

### Long Term
- [ ] Multi-conversation tabs
- [ ] Conversation search
- [ ] AI-suggested follow-ups
- [ ] Conversation analytics

## Files Modified/Created

### New Files
- ✅ `src/hooks/useConversation.js` - Conversation state management
- ✅ `src/components/LLMStepDisplay.jsx` - LLM steps display
- ✅ `src/components/ConversationStyles.css` - Conversation styling
- ✅ `CONVERSATION_API_IMPLEMENTATION.md` - This documentation

### Modified Files
- ✅ `src/components/ChatSidebar.jsx` - Enhanced with conversation support
- ✅ `src/pages/Dashboard.jsx` - Integrated conversation hook
- ✅ `src/services/api.js` - Already had conversation endpoints

## Summary

The conversation API is now **fully integrated** with the Dashboard UI following the N2S Backend API guide. The implementation includes:

✅ 202 Accepted + Polling pattern
✅ Real-time LLM step display
✅ Concurrency protection
✅ Multi-turn conversation support
✅ Comprehensive error handling
✅ Efficient polling with `last_step_id_seen`
✅ Automatic cleanup and memory management
✅ User-friendly UI states and feedback

---

**Implementation Date:** November 19, 2025
**Status:** ✅ Complete and Ready for Testing
**Next Step:** Run application and test conversation flow

