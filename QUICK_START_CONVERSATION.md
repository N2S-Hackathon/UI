# Quick Start - Conversation API

## 🚀 Get Started in 3 Steps

### 1. Run the Application
```bash
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:5173`

### 3. Test the Conversation
1. Click on the **Chat Sidebar** (A-ok Chat Agent)
2. Type a message: `"Create a promotion for -$10 discount"`
3. Watch the magic happen! ✨

---

## What You'll See

### Step 1: Your Message
```
You: Create a promotion for -$10 discount
```

### Step 2: Real-Time Processing
```
A-ok:
  💭 Thinking...
  🔍 Querying Database...
  📊 Analyzing Results...
  💬 Responding...
```

### Step 3: Final Response
```
A-ok: I've created 5 promotions in staging...
```

### Step 4: Follow-Up (Optional)
```
You: Actually, make it -$15
A-ok: I've updated the discount to -$15...
```

---

## Features to Try

### ✅ Multi-Turn Conversations
- Send a follow-up question
- Context is maintained from previous messages
- Claude remembers what you discussed

### ✅ Real-Time Steps
- Watch each processing step appear
- See SQL queries being executed
- Understand what the AI is doing

### ✅ Error Handling
- Try sending two messages rapidly (< 60s)
- See friendly error message
- Send button re-enables after cooldown

### ✅ Processing States
- Input disables during processing
- Processing indicator shows
- Send button shows clear state

---

## Example Prompts to Try

### Promotion Management
- `"Create a promotion for new customers"`
- `"Show me all active promotions"`
- `"End the promotion for 5G Internet"`
- `"Change the discount from 10% to 15%"`

### Analysis
- `"Which promotions are ending soon?"`
- `"Show me promotions for the Atlanta cohort"`
- `"What's the average discount across all promotions?"`

### Follow-Ups
- First: `"Create a -$10 promotion"`
- Then: `"Make it -$15 instead"`
- Then: `"Which cohort should this target?"`

---

## What's Under the Hood

```
Your Message
    ↓
useConversation Hook (manages state)
    ↓
POST /conversation (start) OR POST /conversation/{id}/turn (continue)
    ↓
202 Accepted (request queued)
    ↓
Start Polling Every 2 Seconds
    ↓
GET /conversation?last_step_id_seen={id}
    ↓
Update UI with New LLM Steps
    ↓
Turn Status: completed
    ↓
Stop Polling
    ↓
Display Final Response
```

---

## Troubleshooting

### Message Not Sending?
**Check:** Is input disabled? You might be in processing state
**Fix:** Wait for current turn to complete (watch for final response)

### Error: "Please wait X seconds"
**Cause:** Concurrency protection (60-second cooldown)
**Fix:** Wait for the countdown, then try again

### Steps Not Showing?
**Check:** Is the backend API running?
**Fix:** Ensure API is available at configured URL

### Polling Never Stops?
**Check:** Console logs for errors
**Fix:** May be backend issue - turn never completing

---

## Configuration

### Change API URL
In `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',  // Change this
    //...
  }
}
```

### Change Polling Interval
In `src/hooks/useConversation.js`:
```javascript
setInterval(async () => {
  // Poll logic
}, 2000);  // Change from 2000ms (2s) to desired interval
```

### Change Concurrency Timeout
In `src/hooks/useConversation.js`:
```javascript
if (timeSinceLastRequest < 60) {  // Change from 60 seconds
  // Block logic
}
```

---

## Browser Console

Open DevTools (F12) to see:
- `Loaded products: [...]` - Product data loaded
- `Enriching promotion: {...}` - Promotion enrichment
- `PromotionCard rendering: {...}` - Card rendering
- Conversation polling activity
- Error messages (if any)

---

## Files to Check

### Key Implementation Files
- `src/hooks/useConversation.js` - Conversation logic
- `src/components/LLMStepDisplay.jsx` - Step display
- `src/components/ChatSidebar.jsx` - Chat UI
- `src/pages/Dashboard.jsx` - Integration

### Documentation
- `CONVERSATION_API_IMPLEMENTATION.md` - Technical details
- `OPTIMIZATION_SUMMARY_V2.md` - High-level overview
- `UI_INTEGRATION_GUIDE.md` - API usage guide

---

## Next Steps

### 1. Explore the UI
- Try different prompts
- Experiment with follow-ups
- Watch the step-by-step processing

### 2. Review the Code
- Check `useConversation.js` for state management
- Look at `LLMStepDisplay.jsx` for UI rendering
- Understand polling logic

### 3. Customize
- Adjust polling interval
- Modify step type icons
- Add new conversation contexts

### 4. Test Edge Cases
- Network failures
- Long-running conversations
- Multiple rapid requests
- Error recovery

---

## Questions?

Check the documentation:
- Technical: `CONVERSATION_API_IMPLEMENTATION.md`
- Overview: `OPTIMIZATION_SUMMARY_V2.md`
- API Guide: `UI_INTEGRATION_GUIDE.md`

Or check the inline code comments - every major function is documented!

---

**Happy Chatting! 🎉**

The conversation system is ready to use. Start a chat with A-ok and experience real-time AI-powered promotion management!

