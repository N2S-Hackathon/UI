import { memo, useState, useRef, useEffect } from 'react';

// Format message content with markdown-like syntax
const formatMessageContent = (content) => {
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

const ChatSidebar = memo(({ isOpen, onToggle, messages, onSendMessage, isTyping, onCTAClick }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const handleCTAClick = (action) => {
    if (onCTAClick) {
      onCTAClick(action);
    }
  };
  
  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
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
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="chat-send-button"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              aria-label="Send message"
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

