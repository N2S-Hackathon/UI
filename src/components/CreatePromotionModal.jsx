import { useState, useRef, useEffect, useMemo, memo } from 'react';

const CreatePromotionModal = memo(({ isOpen, onClose, products, cohorts, onSubmit }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    products: [],
    cohort: '',
    discount: '',
    startDate: '',
    endDate: ''
  });
  const [completedFields, setCompletedFields] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showCustomEndDatePicker, setShowCustomEndDatePicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize messages when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: "Great! Let's create a new promotion together. I'll guide you through each step, one at a time. We'll work through the checklist on the left."
      };
      
      const firstQuestion = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Let's start with the basics. What would you like to call this promotion?\n\nFor example: 'Spring Sale 2025' or 'New Customer Welcome'"
      };
      
      setMessages([welcomeMessage, firstQuestion]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Memoize date options
  const quickDateOptions = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return [
      { label: 'Today', date: formatDate(today), value: formatDate(today) },
      { label: 'Tomorrow', date: formatDate(tomorrow), value: formatDate(tomorrow) },
      { label: 'Next Week', date: formatDate(nextWeek), value: formatDate(nextWeek) },
      { label: 'Next Month', date: formatDate(nextMonth), value: formatDate(nextMonth) }
    ];
  }, []);

  const updatePromotionField = (field, value) => {
    setNewPromotion(prev => ({ ...prev, [field]: value }));
    if (!completedFields.includes(field)) {
      setCompletedFields(prev => [...prev, field]);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      if (prev.includes(product)) {
        return prev.filter(p => p !== product);
      } else {
        return [...prev, product];
      }
    });
  };

  const confirmProductSelection = () => {
    if (selectedProducts.length === 0) return;

    updatePromotionField('products', selectedProducts);
    
    const confirmMessage = {
      id: Date.now(),
      type: 'user',
      content: selectedProducts.join(', ')
    };

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: `Great! I've added: ${selectedProducts.join(', ')}. ✓\n\nWho should this promotion target?\n\nSelect a cohort:\n[SHOW_COHORTS]`
    };

    setMessages(prev => [...prev, confirmMessage, botResponse]);
    setSelectedProducts([]);
  };

  const handleCohortSelect = (cohortName) => {
    setSelectedCohort(cohortName);
  };

  const confirmCohortSelection = () => {
    if (!selectedCohort) return;

    updatePromotionField('cohort', selectedCohort);
    
    const cohortData = cohorts.find(c => c.name === selectedCohort);
    const confirmMessage = {
      id: Date.now(),
      type: 'user',
      content: selectedCohort
    };

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: `Perfect! Targeting ${selectedCohort} (${cohortData.estimatedPeople.toLocaleString()} people). ✓\n\nWhat discount percentage would you like to offer?\n\nFor example: "25%" or "30 percent"`
    };

    setMessages(prev => [...prev, confirmMessage, botResponse]);
    setSelectedCohort(null);
  };

  const confirmStartDateSelection = () => {
    if (!selectedStartDate) return;

    updatePromotionField('startDate', selectedStartDate);
    
    const confirmMessage = {
      id: Date.now(),
      type: 'user',
      content: selectedStartDate
    };

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: `Got it! Starting on ${selectedStartDate}. ✓\n\nWhen should it end?\n\nChoose an end date:\n[SHOW_END_DATE_PICKER]`
    };

    setMessages(prev => [...prev, confirmMessage, botResponse]);
    setSelectedStartDate(null);
    setShowCustomDatePicker(false);
  };

  const confirmEndDateSelection = () => {
    if (!selectedEndDate) return;

    updatePromotionField('endDate', selectedEndDate);
    
    const confirmMessage = {
      id: Date.now(),
      type: 'user',
      content: selectedEndDate
    };

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: `Perfect! Ending on ${selectedEndDate}. ✓\n\n🎉 All done! Here's your new promotion:\n\n**${newPromotion.name}**\n• Products: ${newPromotion.products.join(', ')}\n• Target: ${newPromotion.cohort}\n• Discount: ${newPromotion.discount}%\n• Duration: ${newPromotion.startDate} to ${selectedEndDate}\n\nType "create" to finalize, or "change [field]" to modify something.`
    };

    setMessages(prev => [...prev, confirmMessage, botResponse]);
    setSelectedEndDate(null);
    setShowCustomEndDatePicker(false);
  };

  const handleEditTask = (field) => {
    // Get field name for display
    const fieldNames = {
      name: 'promotion name',
      products: 'products',
      cohort: 'target cohort',
      discount: 'discount rate',
      startDate: 'start date',
      endDate: 'end date'
    };

    // Clear the field value
    if (field === 'products') {
      setNewPromotion(prev => ({ ...prev, [field]: [] }));
      setSelectedProducts([]);
    } else if (field === 'cohort') {
      setNewPromotion(prev => ({ ...prev, [field]: '' }));
      setSelectedCohort(null);
    } else if (field === 'startDate') {
      setNewPromotion(prev => ({ ...prev, [field]: '' }));
      setSelectedStartDate(null);
      setShowCustomDatePicker(false);
    } else if (field === 'endDate') {
      setNewPromotion(prev => ({ ...prev, [field]: '' }));
      setSelectedEndDate(null);
      setShowCustomEndDatePicker(false);
    } else {
      setNewPromotion(prev => ({ ...prev, [field]: '' }));
    }

    // Remove from completed fields
    setCompletedFields(prev => prev.filter(f => f !== field));

    // Add A-OK message about editing
    let editMessage;
    if (field === 'products') {
      editMessage = {
        id: Date.now(),
        type: 'bot',
        content: `No problem! Let's update the ${fieldNames[field]}.\n\nClick on the products below to select them (you can select multiple):\n[SHOW_PRODUCTS]`
      };
    } else if (field === 'cohort') {
      editMessage = {
        id: Date.now(),
        type: 'bot',
        content: `No problem! Let's update the ${fieldNames[field]}.\n\nSelect a cohort:\n[SHOW_COHORTS]`
      };
    } else if (field === 'startDate') {
      editMessage = {
        id: Date.now(),
        type: 'bot',
        content: `No problem! Let's update the ${fieldNames[field]}.\n\nChoose a date:\n[SHOW_DATE_PICKER]`
      };
    } else if (field === 'endDate') {
      editMessage = {
        id: Date.now(),
        type: 'bot',
        content: `No problem! Let's update the ${fieldNames[field]}.\n\nChoose an end date:\n[SHOW_END_DATE_PICKER]`
      };
    } else {
      editMessage = {
        id: Date.now(),
        type: 'bot',
        content: `No problem! Let's update the ${fieldNames[field]}. What would you like to change it to?`
      };
    }

    setMessages(prev => [...prev, editMessage]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();

    setTimeout(() => {
      let botResponse = '';
      let fieldToUpdate = null;
      let valueToSet = null;
      
      if (!newPromotion.name) {
        fieldToUpdate = 'name';
        valueToSet = userInput;
        botResponse = `Perfect! "${userInput}" is a great name. ✓\n\nNext, which products should be included in this promotion?\n\nClick on the products below to select them (you can select multiple):\n[SHOW_PRODUCTS]`;
      } else if (!newPromotion.discount) {
        const discountMatch = userInput.match(/(\d+)/);
        if (discountMatch) {
          const discount = parseInt(discountMatch[1]);
          if (discount > 0 && discount <= 100) {
            fieldToUpdate = 'discount';
            valueToSet = discount.toString();
            botResponse = `Excellent! ${discount}% discount it is. ✓\n\nWhen should this promotion start?\n\nChoose a date:\n[SHOW_DATE_PICKER]`;
          } else {
            botResponse = `The discount should be between 1% and 100%. What percentage would you like?`;
          }
        } else {
          botResponse = `I need a number for the discount. For example: "25" or "30%"`;
        }
      } else if (userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('confirm')) {
        botResponse = `🎉 Fantastic! "${newPromotion.name}" has been created and is ready for review. You'll find it in the scheduled promotions section.\n\nThe modal will close in a moment...`;
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        botResponse = `I'm here to help! Please follow the prompts above or type "create" when you're ready to finalize.`;
      }

      if (fieldToUpdate && valueToSet !== null) {
        updatePromotionField(fieldToUpdate, valueToSet);
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse
      }]);
    }, 600);

    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div>
              <h3>Create New Promotion</h3>
              <p className="modal-subtitle">A-OK Agent will guide you through the process</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-content create-modal-content">
          <div className="create-layout">
            {/* Left Side - Task List */}
            <div className="create-task-list">
              <h4>Setup Progress</h4>
              
              <div className="progress-checklist-vertical">
                {[
                  { field: 'name', label: 'Promotion Name', value: newPromotion.name },
                  { field: 'products', label: 'Products', value: newPromotion.products.length > 0 ? `${newPromotion.products.length} selected` : '' },
                  { field: 'cohort', label: 'Target Cohort', value: newPromotion.cohort },
                  { field: 'discount', label: 'Discount Rate', value: newPromotion.discount ? `${newPromotion.discount}%` : '' },
                  { field: 'startDate', label: 'Start Date', value: newPromotion.startDate },
                  { field: 'endDate', label: 'End Date', value: newPromotion.endDate }
                ].map((item, index) => (
                  <div 
                    key={item.field}
                    className={`checklist-item-large ${completedFields.includes(item.field) ? 'completed' : completedFields.length === index ? 'active' : ''}`}
                  >
                    <div className="checklist-icon-large">
                      {completedFields.includes(item.field) ? '✓' : index + 1}
                    </div>
                    <div className="checklist-content">
                      <span className="checklist-title">{item.label}</span>
                      {item.value && <span className="checklist-value">{item.value}</span>}
                    </div>
                    {completedFields.includes(item.field) && (
                      <button 
                        className="edit-task-button"
                        onClick={() => handleEditTask(item.field)}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Conversation */}
            <div className="create-conversation">
              <div className="modal-messages">
                {messages.map((message) => {
                  const showProducts = message.content.includes('[SHOW_PRODUCTS]');
                  const showCohorts = message.content.includes('[SHOW_COHORTS]');
                  const showDatePicker = message.content.includes('[SHOW_DATE_PICKER]');
                  const showEndDatePicker = message.content.includes('[SHOW_END_DATE_PICKER]');
                  let cleanContent = message.content
                    .replace('[SHOW_PRODUCTS]', '')
                    .replace('[SHOW_COHORTS]', '')
                    .replace('[SHOW_DATE_PICKER]', '')
                    .replace('[SHOW_END_DATE_PICKER]', '');
                  
                  return (
                    <div key={message.id}>
                      <div className={`modal-message ${message.type}`}>
                        {message.type === 'bot' && (
                          <div className="modal-message-avatar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </div>
                        )}
                        <div className="modal-message-content" style={{ whiteSpace: 'pre-line' }}>
                          {cleanContent}
                        </div>
                      </div>
                      
                      {showProducts && newPromotion.products.length === 0 && (
                        <div className="product-selection-panel">
                          <div className="product-buttons">
                            {products.map(product => (
                              <button
                                key={product.id}
                                className={`product-button ${selectedProducts.includes(product.name) ? 'selected' : ''}`}
                                onClick={() => handleProductSelect(product.name)}
                              >
                                {selectedProducts.includes(product.name) && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                                {product.name}
                              </button>
                            ))}
                          </div>
                          <button
                            className="confirm-selection-button"
                            onClick={confirmProductSelection}
                            disabled={selectedProducts.length === 0}
                          >
                            Confirm Selection ({selectedProducts.length} selected)
                          </button>
                        </div>
                      )}
                      
                      {showCohorts && !newPromotion.cohort && (
                        <div className="cohort-selection-panel">
                          <div className="cohort-buttons">
                            {cohorts.map(cohort => (
                              <button
                                key={cohort.id}
                                className={`cohort-button ${selectedCohort === cohort.name ? 'selected' : ''}`}
                                onClick={() => handleCohortSelect(cohort.name)}
                              >
                                <div className="cohort-button-header">
                                  {selectedCohort === cohort.name && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                  <span className="cohort-button-name">{cohort.name}</span>
                                </div>
                                <div className="cohort-button-details">
                                  <span className="cohort-button-zip">📍 {cohort.zip}</span>
                                  <span className="cohort-button-people">👥 {cohort.estimatedPeople.toLocaleString()}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            className="confirm-selection-button"
                            onClick={confirmCohortSelection}
                            disabled={!selectedCohort}
                          >
                            Confirm Selection
                          </button>
                        </div>
                      )}
                      
                      {showDatePicker && !newPromotion.startDate && (
                        <div className="date-selection-panel">
                          <div className="quick-date-buttons">
                            {quickDateOptions.map(option => (
                              <button
                                key={option.label}
                                className={`date-button ${selectedStartDate === option.value ? 'selected' : ''}`}
                                onClick={() => setSelectedStartDate(option.value)}
                              >
                                <div className="date-button-content">
                                  <span className="date-label">{option.label}</span>
                                  <span className="date-value">{option.date}</span>
                                </div>
                                {selectedStartDate === option.value && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                          <button
                            className="confirm-selection-button"
                            onClick={confirmStartDateSelection}
                            disabled={!selectedStartDate}
                          >
                            Confirm Date
                          </button>
                        </div>
                      )}
                      
                      {showEndDatePicker && !newPromotion.endDate && (
                        <div className="date-selection-panel">
                          <div className="quick-date-buttons">
                            {quickDateOptions.map(option => (
                              <button
                                key={option.label}
                                className={`date-button ${selectedEndDate === option.value ? 'selected' : ''}`}
                                onClick={() => setSelectedEndDate(option.value)}
                              >
                                <div className="date-button-content">
                                  <span className="date-label">{option.label}</span>
                                  <span className="date-value">{option.date}</span>
                                </div>
                                {selectedEndDate === option.value && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                          <button
                            className="confirm-selection-button"
                            onClick={confirmEndDateSelection}
                            disabled={!selectedEndDate}
                          >
                            Confirm End Date
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Submit Button - appears when all 6 tasks are completed */}
              {completedFields.length === 6 && (
                <div className="conversation-submit-area">
                  <button 
                    className="submit-promotion-button"
                    onClick={() => {
                      // Pass the new promotion data back to parent
                      if (onSubmit) {
                        onSubmit({
                          ...newPromotion,
                          id: Date.now(),
                          status: 'pending'
                        });
                      }
                      onClose();
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Create Prompt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <input
            type="text"
            placeholder="Ask A-OK for help or guidance..."
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

CreatePromotionModal.displayName = 'CreatePromotionModal';

export default CreatePromotionModal;

