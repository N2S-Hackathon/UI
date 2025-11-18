# Conversation API Integration Guide

## Overview
The conversation API enables agentic interactions with Claude Opus for bulk data management tasks. This guide shows how to integrate it with the chat sidebar.

## Quick Start

### 1. Import the API Functions

```javascript
import { createConversation, getActiveConversation } from '../services/api';
```

### 2. Create a Conversation

```javascript
// When user sends a message in chat
const handleSendMessage = async (userMessage) => {
  try {
    // Create conversation with context
    const result = await createConversation('dashboard', userMessage);
    
    console.log('Conversation started:', result.conversationId);
    
    // Start polling for Claude's response
    pollForUpdates(result.conversationId);
  } catch (error) {
    console.error('Failed to start conversation:', error);
  }
};
```

### 3. Poll for Updates

```javascript
// Poll for new turns in the conversation
const pollForUpdates = async (conversationId, lastTurnSeen = null) => {
  try {
    const conversation = await getActiveConversation(lastTurnSeen);
    
    // Process new turns
    conversation.turns.forEach(turn => {
      // Add user message
      addMessageToChat({
        type: 'user',
        content: turn.userMessage
      });
      
      // Add LLM responses
      turn.llmSteps.forEach(step => {
        if (step.output) {
          addMessageToChat({
            type: 'bot',
            content: step.output,
            stepType: step.stepType
          });
        }
      });
    });
    
    // Continue polling if conversation is active
    if (conversation.turns.length > 0) {
      setTimeout(() => {
        pollForUpdates(conversationId, conversation.turns.length);
      }, 2000); // Poll every 2 seconds
    }
  } catch (error) {
    console.error('Polling error:', error);
  }
};
```

## Integration with ChatSidebar

### Recommended Approach

Update the `Dashboard.jsx` to handle chat messages:

```javascript
const handleChatMessage = useCallback(async (message) => {
  // Add user message immediately
  setChatMessages(prev => [...prev, {
    id: Date.now(),
    type: 'user',
    content: message
  }]);
  
  try {
    // Create conversation
    const result = await createConversation('promotions', message);
    
    // Add loading indicator
    setChatMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'bot',
      content: 'Processing your request...',
      loading: true
    }]);
    
    // Poll for response
    pollConversation(result.conversationId);
  } catch (error) {
    // Add error message
    setChatMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'bot',
      content: 'Sorry, I encountered an error. Please try again.',
      error: true
    }]);
  }
}, []);
```

## Context Paths

Use appropriate context paths based on the user's intent:

- `'promotions'` - Creating, updating, or managing promotions
- `'products'` - Product-related queries
- `'cohorts'` - Cohort management and segmentation
- `'dashboard'` - General dashboard operations
- `'bulk-update'` - Bulk data operations

## Response Structure

### Conversation Response
```javascript
{
  conversationId: "uuid-string",
  name: "Optional conversation name",
  startedAt: "2025-11-18T...",
  turns: [
    {
      turnId: "uuid-string",
      userMessage: "Create a Black Friday promotion",
      createdAt: "2025-11-18T...",
      llmSteps: [
        {
          stepId: "uuid-string",
          stepType: "thinking" | "tool_use" | "response",
          input: "Input to this step",
          output: "Output from this step",
          createdAt: "2025-11-18T..."
        }
      ]
    }
  ]
}
```

## Step Types

Claude's responses include different step types:

1. **thinking** - Internal reasoning (may want to hide from user)
2. **tool_use** - API calls or actions (show as "Taking action...")
3. **response** - Final response to user (display in chat)

### Example Processing

```javascript
turn.llmSteps.forEach(step => {
  switch (step.stepType) {
    case 'thinking':
      // Optional: Show as "Claude is thinking..."
      break;
      
    case 'tool_use':
      addMessageToChat({
        type: 'system',
        content: `Taking action: ${step.input}`
      });
      break;
      
    case 'response':
      addMessageToChat({
        type: 'bot',
        content: step.output
      });
      break;
  }
});
```

## Error Handling

```javascript
try {
  const result = await createConversation(context, prompt);
} catch (error) {
  if (error.message.includes('422')) {
    // Validation error - check prompt format
    console.error('Invalid request format');
  } else if (error.message.includes('500')) {
    // Server error - retry or show error
    console.error('Server error, please try again');
  } else {
    // Network error
    console.error('Network error:', error);
  }
}
```

## Best Practices

### 1. Debounce Polling
Don't poll too frequently - 2-3 second intervals are sufficient:

```javascript
const POLL_INTERVAL = 2000; // 2 seconds
```

### 2. Stop Polling When Done
Stop polling when conversation reaches a natural end or timeout:

```javascript
let pollAttempts = 0;
const MAX_POLL_ATTEMPTS = 30; // Stop after 60 seconds

if (pollAttempts >= MAX_POLL_ATTEMPTS) {
  console.log('Polling timeout');
  return;
}
```

### 3. Show Loading States
Always indicate when Claude is processing:

```javascript
<div className="message bot loading">
  <span className="typing-indicator">●●●</span>
  Thinking...
</div>
```

### 4. Handle Streaming
Process LLM steps as they arrive for responsive UX:

```javascript
// Update last message instead of adding new ones
if (isStreaming) {
  setChatMessages(prev => {
    const newMessages = [...prev];
    newMessages[newMessages.length - 1].content = step.output;
    return newMessages;
  });
}
```

## Example: Full Integration

```javascript
// In Dashboard.jsx
import { createConversation, getActiveConversation } from '../services/api';

function Dashboard() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleChatSubmit = async (message) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Add user message
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: message
    }]);
    
    try {
      // Determine context based on active tab
      const context = activeTab === 'promotion' ? 'promotions' 
                    : activeTab === 'cohorts' ? 'cohorts' 
                    : 'products';
      
      // Create conversation
      const conv = await createConversation(context, message);
      setActiveConversation(conv.conversationId);
      
      // Start polling
      pollConversation();
    } catch (error) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: 'Failed to process request'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const pollConversation = async () => {
    try {
      const conv = await getActiveConversation();
      
      // Process latest turn
      if (conv.turns.length > 0) {
        const latestTurn = conv.turns[conv.turns.length - 1];
        
        latestTurn.llmSteps
          .filter(s => s.stepType === 'response' && s.output)
          .forEach(step => {
            setChatMessages(prev => [...prev, {
              id: step.stepId,
              type: 'bot',
              content: step.output
            }]);
          });
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };
  
  return (
    // ... existing dashboard code
    <ChatSidebar 
      messages={chatMessages}
      onSubmit={handleChatSubmit}
      isProcessing={isProcessing}
    />
  );
}
```

## Testing

Test conversation API with:

```bash
# Create a conversation
curl -X POST http://3.136.171.60/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "context_path": "promotions",
    "prompt": "Show me all active promotions"
  }'

# Get active conversation
curl http://3.136.171.60/conversation
```

## Next Steps

1. Update `ChatSidebar.jsx` to accept `onSubmit` prop
2. Add message input handling in Dashboard
3. Implement polling logic with proper state management
4. Add visual indicators for processing states
5. Handle conversation history and context
6. Implement conversation switching/history view

