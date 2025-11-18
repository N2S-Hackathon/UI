import { useState, memo } from 'react';

const AgentModal = memo(({ isOpen, onClose, promotion, cohort, action }) => {
  const [messages, setMessages] = useState(() => {
    let initialMessage = '';
    const item = promotion || cohort;
    const itemName = promotion ? promotion.name : cohort ? cohort.name : '';
    
    if (cohort) {
      // Cohort-specific actions
      switch(action) {
        case 'create-promotion':
          initialMessage = `I can help you create a targeted promotion for the "${cohort.name}" cohort (${cohort.estimatedPeople.toLocaleString()} people). What type of offer would you like to create?`;
          break;
        case 'analytics':
          initialMessage = `Here's a detailed analysis of the "${cohort.name}" cohort:\n\n• Engagement Rate: High\n• Revenue Trend: Growing\n• Churn Risk: ${cohort.name.includes('At-Risk') ? 'High - requires immediate attention' : 'Low'}\n\nWhat specific metrics would you like to explore?`;
          break;
        case 'modify':
          const zipList = cohort.zipCodes.map(z => z.zip).join(', ');
          initialMessage = `I can help you modify the criteria for "${cohort.name}". Currently targeting ${cohort.zipCodes.length} zip codes: ${zipList}. What changes would you like to make?`;
          break;
        case 'export':
          initialMessage = `I can export data for "${cohort.name}" (${cohort.estimatedPeople.toLocaleString()} customers). What format would you prefer? CSV, Excel, or JSON?`;
          break;
        case 'campaign':
          initialMessage = `Let's create a campaign for "${cohort.name}". Would you like to send an email, SMS, or in-app notification to these ${cohort.estimatedPeople.toLocaleString()} customers?`;
          break;
        default:
          initialMessage = `How can I help you with the "${cohort.name}" cohort?`;
      }
    } else if (promotion) {
      // Promotion-specific actions
      switch(action) {
        case 'modify':
          initialMessage = `I can help you modify "${promotion.name}". What would you like to change? I can update the end date, discount rate, products, or target cohort.`;
          break;
        case 'products':
          initialMessage = `Here are the products included in "${promotion.name}": ${promotion.products.join(', ')}. Would you like to add or remove any products?`;
          break;
        case 'cohort':
          initialMessage = `"${promotion.name}" currently applies to: ${promotion.cohort}. Would you like to change the target cohort?`;
          break;
        case 'discount':
          initialMessage = `"${promotion.name}" offers a ${promotion.discount}% discount. Would you like to adjust this rate?`;
          break;
        case 'credit':
          initialMessage = `I can help you adjust the credit terms for "${promotion.name}". Would you like to modify the credit amount or duration?`;
          break;
        case 'dates':
          if (promotion.status === 'scheduled') {
            initialMessage = `"${promotion.name}" is scheduled from ${promotion.startDate} to ${promotion.endDate}. Would you like to modify these dates?`;
          } else {
            initialMessage = `"${promotion.name}" ends on ${promotion.endDate}. Would you like to extend or change the end date?`;
          }
          break;
        case 'end':
          initialMessage = `Are you sure you want to end "${promotion.name}"? This action will stop the promotion immediately. Please confirm or let me know if you'd like to schedule an end date instead.`;
          break;
        default:
          initialMessage = `How can I help you with "${promotion.name}"?`;
      }
    }
    
    return [{
      id: Date.now(),
      type: 'bot',
      content: initialMessage
    }];
  });
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const item = promotion || cohort;
      const itemName = promotion ? promotion.name : cohort ? cohort.name : '';
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I understand. Let me help you with that for "${itemName}". This feature will be fully implemented soon.`
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <h3>A-OK Agent</h3>
              <p className="modal-subtitle">{promotion ? promotion.name : cohort ? cohort.name : ''}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-messages">
            {messages.map((message) => (
              <div key={message.id} className={`modal-message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="modal-message-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                )}
                <div className="modal-message-content">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="modal-input"
          />
          <button 
            className="modal-send-button"
            onClick={sendMessage}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

AgentModal.displayName = 'AgentModal';

export default AgentModal;

