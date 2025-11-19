import { memo, useState, useRef, useEffect } from 'react';
import LLMStepDisplay from './LLMStepDisplay';
import './ConversationStyles.css';

// Format message content with markdown-like syntax
const formatMessageContent = (content) => {
  if (!content) return null;
  
  const lines = content.split('\n');
  return lines.map((line, index) => {
    // Handle bold text **text**
    const boldFormatted = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    
    return (
      <div key={index}>
        {boldFormatted}
        {index < lines.length - 1 && <br />}
      </div>
    );
  });
};

// Typing indicator component
const TypingIndicator = () => (
  <div className="chat-message bot">
    <div className="message-avatar">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

const ChatSidebar = memo(({ 
  isOpen, 
  onToggle, 
  messages, 
  onSendMessage, 
  isTyping, 
  onCTAClick,
  conversationTurns = [],
  isProcessing = false,
  canSendMessage = true,
  error = null
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, conversationTurns]);
  
  const handleCTAClick = (action) => {
    if (onCTAClick) {
      onCTAClick(action);
    }
  };
  
  const handleSend = () => {
    if (inputValue.trim() && onSendMessage && canSendMessage) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>A-ok Chat Agent</h3>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div className="chat-content">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                )}
                <div className="message-content">
                  {formatMessageContent(message.content)}
                  {message.actions && message.actions.length > 0 && (
                    <div className="message-actions">
                      {message.actions.map((action, idx) => (
                        <button
                          key={idx}
                          className={`chat-cta-button ${action.style || 'primary'}`}
                          onClick={() => handleCTAClick(action.action)}
                        >
                          {action.icon && <span className="cta-icon">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Display conversation turns with LLM steps */}
            {conversationTurns.map((turn) => (
              <div key={turn.turnId}>
                {/* User message */}
                {turn.userMessage && (
                  <div className="chat-message user">
                    <div className="message-content">
                      {turn.userMessage}
                    </div>
                  </div>
                )}
                
                {/* LLM Steps */}
                {turn.llmSteps && turn.llmSteps.length > 0 && (
                  <div className="chat-message bot">
                    <div className="message-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div className="message-content">
                      <LLMStepDisplay 
                        steps={turn.llmSteps} 
                        isProcessing={turn.status !== 'completed'}
                      />
                    </div>
                  </div>
                )}
                
                {/* Final Response */}
                {turn.assistantResponse && turn.status === 'completed' && (
                  <div className="chat-message bot">
                    <div className="message-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div className="message-content">
                      {formatMessageContent(turn.assistantResponse)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
            
            {/* Error display */}
            {error && (
              <div className="chat-message error">
                <div className="message-content" style={{ 
                  backgroundColor: '#fee', 
                  border: '1px solid #fcc',
                  padding: '10px',
                  borderRadius: '6px',
                  color: '#c00'
                }}>
                  ⚠️ {error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-container">
            {isProcessing && (
              <div className="processing-status">
                <span className="status-dot processing"></span>
                Processing... (new messages disabled)
              </div>
            )}
            {!canSendMessage && !isProcessing && error && (
              <div className="processing-status" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                <span className="status-dot" style={{ backgroundColor: '#ffc107' }}></span>
                Please wait before sending another message
              </div>
            )}
            <input
              type="text"
              placeholder={canSendMessage ? "Ask me anything..." : isProcessing ? "Wait for response..." : "Please wait..."}
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!canSendMessage}
              style={!canSendMessage ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
            />
            <button 
              className="chat-send-button"
              onClick={handleSend}
              disabled={!inputValue.trim() || !canSendMessage}
              aria-label="Send message"
              title={!canSendMessage ? (isProcessing ? 'Wait for current response to complete' : 'Please wait before sending another message') : 'Send message'}
              style={!canSendMessage ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
});

ChatSidebar.displayName = 'ChatSidebar';

export default ChatSidebar;

