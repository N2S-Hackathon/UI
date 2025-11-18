import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('promotion');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [expandedPromotions, setExpandedPromotions] = useState({});
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your A-OK assistant. How can I help you manage your ISP operations today?"
    }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalMessages, setModalMessages] = useState([]);
  const [modalInput, setModalInput] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  
  // Create Promotion Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createMessages, setCreateMessages] = useState([]);
  const [createInput, setCreateInput] = useState('');
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    products: [],
    cohort: '',
    discount: '',
    startDate: '',
    endDate: ''
  });
  const [completedFields, setCompletedFields] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedCohort, setSelectedCohort] = useState(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current && createMessages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [createMessages]);

  // Product data
  const products = [
    {
      id: 1,
      name: 'Basic 100 Mbps',
      description: 'Perfect for light browsing and streaming',
      speed: '100 Mbps',
      price: 39.99,
      type: 'Residential',
      features: ['Up to 100 Mbps', 'Unlimited data', 'Free installation', '24/7 support'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Fiber 500 Mbps',
      description: 'High-speed internet for families',
      speed: '500 Mbps',
      price: 59.99,
      type: 'Residential',
      features: ['Up to 500 Mbps', 'Unlimited data', 'Free WiFi router', 'Priority support'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Fiber 1 Gbps',
      description: 'Ultimate speed for power users',
      speed: '1 Gbps',
      price: 79.99,
      type: 'Residential',
      features: ['Up to 1 Gbps', 'Unlimited data', 'Premium WiFi 6 router', 'VIP support'],
      status: 'active'
    },
    {
      id: 4,
      name: 'Business Pro',
      description: 'Reliable connectivity for small businesses',
      speed: '500 Mbps',
      price: 99.99,
      type: 'Business',
      features: ['Up to 500 Mbps', 'Static IP address', 'Business-grade support', 'SLA guarantee'],
      status: 'active'
    },
    {
      id: 5,
      name: 'Enterprise',
      description: 'Enterprise-grade internet solution',
      speed: '1 Gbps+',
      price: 199.99,
      type: 'Business',
      features: ['Custom bandwidth', 'Dedicated fiber', 'Enterprise support', '99.9% uptime SLA'],
      status: 'active'
    },
    {
      id: 6,
      name: 'Premium Support',
      description: 'Enhanced support package for any plan',
      speed: 'N/A',
      price: 14.99,
      type: 'Add-on',
      features: ['Priority phone support', 'Same-day service', 'Remote diagnostics', 'Annual tech visit'],
      status: 'active'
    }
  ];

  // Cohort data
  const cohorts = [
    {
      id: 1,
      name: 'New Customers',
      zip: '10001',
      estimatedPeople: 2450,
      description: 'Customers who signed up in the last 90 days'
    },
    {
      id: 2,
      name: 'Existing Customers',
      zip: '10002',
      estimatedPeople: 8920,
      description: 'Active customers beyond initial 90-day period'
    },
    {
      id: 3,
      name: 'First-time Subscribers',
      zip: '10003',
      estimatedPeople: 1580,
      description: 'Never subscribed to any ISP service before'
    },
    {
      id: 4,
      name: 'Long-term Customers',
      zip: '10004',
      estimatedPeople: 5340,
      description: 'Loyal customers with 2+ years of service'
    },
    {
      id: 5,
      name: 'High-Value Segment',
      zip: '10005',
      estimatedPeople: 1120,
      description: 'Premium tier customers with high usage'
    },
    {
      id: 6,
      name: 'At-Risk Customers',
      zip: '10006',
      estimatedPeople: 890,
      description: 'Customers showing signs of churn'
    },
    {
      id: 7,
      name: 'Rural Area Residents',
      zip: '10007',
      estimatedPeople: 3240,
      description: 'Customers in rural zip codes'
    },
    {
      id: 8,
      name: 'Urban Professionals',
      zip: '10008',
      estimatedPeople: 4670,
      description: 'Business district residents and professionals'
    }
  ];

  // Promotion data with products and performance metrics
  const promotions = [
    {
      id: 1,
      name: 'Summer Speed Boost',
      status: 'active',
      startDate: 'Nov 1, 2025',
      endDate: 'Dec 31, 2025',
      discount: 25,
      products: ['Fiber 500 Mbps', 'Fiber 1 Gbps', 'Business Pro'],
      cohort: 'New Customers',
      revenueImpact: '$18.5K',
      conversionRate: '72%'
    },
    {
      id: 2,
      name: 'New Customer Welcome',
      status: 'active',
      startDate: 'Oct 15, 2025',
      endDate: 'Jan 15, 2026',
      discount: 30,
      products: ['Basic 100 Mbps', 'Fiber 500 Mbps'],
      cohort: 'First-time Subscribers',
      revenueImpact: '$15.8K',
      conversionRate: '68%'
    },
    {
      id: 3,
      name: 'Loyalty Rewards',
      status: 'scheduled',
      startDate: 'Dec 1, 2025',
      endDate: 'Mar 31, 2026',
      discount: 20,
      products: ['Fiber 1 Gbps', 'Business Pro', 'Enterprise'],
      cohort: 'Long-term Customers',
      revenueImpact: null,
      conversionRate: null
    },
    {
      id: 4,
      name: 'Black Friday Special',
      status: 'active',
      startDate: 'Nov 15, 2025',
      endDate: 'Nov 30, 2025',
      discount: 40,
      products: ['Fiber 500 Mbps', 'Fiber 1 Gbps'],
      cohort: 'All Customers',
      revenueImpact: '$22.3K',
      conversionRate: '85%'
    },
    {
      id: 5,
      name: 'Holiday Bundle Deal',
      status: 'active',
      startDate: 'Nov 10, 2025',
      endDate: 'Dec 15, 2025',
      discount: 35,
      products: ['Fiber 1 Gbps', 'Business Pro', 'Premium Support'],
      cohort: 'Existing Customers',
      revenueImpact: '$19.7K',
      conversionRate: '74%'
    }
  ];

  const togglePromotion = (promotionId) => {
    setExpandedPromotions(prev => ({
      ...prev,
      [promotionId]: !prev[promotionId]
    }));
  };

  const openModal = (promotion, action) => {
    setSelectedPromotion(promotion);
    setModalAction(action);
    setModalOpen(true);
    
    // Initialize modal conversation based on action
    let initialMessage = '';
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
      case 'dates':
        if (promotion.status === 'scheduled') {
          initialMessage = `"${promotion.name}" is scheduled from ${promotion.startDate} to ${promotion.endDate}. Would you like to modify these dates?`;
        } else {
          initialMessage = `"${promotion.name}" ends on ${promotion.endDate}. Would you like to extend or change the end date?`;
        }
        break;
      default:
        initialMessage = `How can I help you with "${promotion.name}"?`;
    }
    
    setModalMessages([{
      id: Date.now(),
      type: 'bot',
      content: initialMessage
    }]);
    setNewEndDate(promotion.endDate);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setSelectedPromotion(null);
    setModalMessages([]);
    setModalInput('');
    setNewEndDate('');
  };

  const sendModalMessage = () => {
    if (!modalInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: modalInput
    };

    setModalMessages(prev => [...prev, userMessage]);

    // Handle responses based on action type
    setTimeout(() => {
      let botResponse = '';
      
      if (modalAction === 'modify' && modalInput.toLowerCase().includes('end date')) {
        botResponse = `I can help you change the end date for "${selectedPromotion.name}". The current end date is ${selectedPromotion.endDate}. What would you like the new end date to be?`;
      } else if (modalAction === 'modify') {
        botResponse = `Got it! For "${selectedPromotion.name}", I can help you with that. Please provide the new details you'd like to update.`;
      } else {
        botResponse = `I understand. Let me help you with that for "${selectedPromotion.name}". This feature will be fully implemented soon.`;
      }

      setModalMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse
      }]);
    }, 500);

    setModalInput('');
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
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
    
    setCreateMessages([welcomeMessage, firstQuestion]);
    setCompletedFields([]);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setCreateMessages([]);
    setCreateInput('');
    setNewPromotion({
      name: '',
      products: [],
      cohort: '',
      discount: '',
      startDate: '',
      endDate: ''
    });
    setCompletedFields([]);
  };

  const updatePromotionField = (field, value) => {
    setNewPromotion(prev => ({ ...prev, [field]: value }));
    if (!completedFields.includes(field)) {
      setCompletedFields(prev => [...prev, field]);
    }
  };

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      if (prev.includes(product)) {
        // Deselect
        return prev.filter(p => p !== product);
      } else {
        // Select
        return [...prev, product];
      }
    });
  };

  const confirmProductSelection = () => {
    if (selectedProducts.length === 0) {
      return;
    }

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

    setCreateMessages(prev => [...prev, confirmMessage, botResponse]);
    setSelectedProducts([]);
  };

  const handleCohortSelect = (cohortName) => {
    setSelectedCohort(cohortName);
  };

  const confirmCohortSelection = () => {
    if (!selectedCohort) {
      return;
    }

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

    setCreateMessages(prev => [...prev, confirmMessage, botResponse]);
    setSelectedCohort(null);
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
    } else {
      editMessage = {
        id: Date.now(),
        type: 'bot',
        content: `No problem! Let's update the ${fieldNames[field]}. What would you like to change it to?`
      };
    }

    setCreateMessages(prev => [...prev, editMessage]);
  };

  const sendCreateMessage = () => {
    if (!createInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: createInput
    };

    setCreateMessages(prev => [...prev, userMessage]);
    const input = createInput.trim();

    // Process response based on current step
    setTimeout(() => {
      let botResponse = '';
      let fieldToUpdate = null;
      let valueToSet = null;
      
      // Determine what step we're on
      if (!newPromotion.name) {
        // Step 1: Promotion Name
        fieldToUpdate = 'name';
        valueToSet = input;
        botResponse = `Perfect! "${input}" is a great name. ✓\n\nNext, which products should be included in this promotion?\n\nClick on the products below to select them (you can select multiple):`;
        // Add special marker for product selection
        botResponse += '\n[SHOW_PRODUCTS]';
      } else if (newPromotion.products.length === 0) {
        // Step 2: Products - should not reach here if using buttons, but handle typing
        fieldToUpdate = 'products';
        const productNames = products.map(p => p.name);
        if (input.toLowerCase().includes('all')) {
          valueToSet = productNames;
          botResponse = `Excellent! All products will be included. ✓\n\nWho should this promotion target?\n\nSelect a cohort:`;
        } else {
          // Parse comma-separated products
          const inputLower = input.toLowerCase();
          const selectedProducts = productNames.filter(p => 
            inputLower.includes(p.toLowerCase()) || 
            inputLower.includes(p.split(' ')[0].toLowerCase())
          );
          
          if (selectedProducts.length > 0) {
            valueToSet = selectedProducts;
            botResponse = `Great! I've added: ${selectedProducts.join(', ')}. ✓\n\nWho should this promotion target?\n\nSelect a cohort:`;
          } else {
            botResponse = `I couldn't find those products. Please click on the products above or type "all products".`;
          }
        }
      } else if (!newPromotion.cohort) {
        // Step 3: Cohort - should not reach here if using buttons, but handle typing
        fieldToUpdate = 'cohort';
        const cohortNames = cohorts.map(c => c.name);
        const matchedCohort = cohortNames.find(c => input.toLowerCase().includes(c.toLowerCase()));
        
        if (matchedCohort) {
          valueToSet = matchedCohort;
          const cohortData = cohorts.find(c => c.name === matchedCohort);
          botResponse = `Perfect! Targeting ${matchedCohort} (${cohortData.estimatedPeople.toLocaleString()} people). ✓\n\nWhat discount percentage would you like to offer?\n\nFor example: "25%" or "30 percent"`;
        } else {
          botResponse = `I couldn't find that cohort. Please click on one of the cohorts above.`;
        }
      } else if (!newPromotion.discount) {
        // Step 4: Discount
        const discountMatch = input.match(/(\d+)/);
        if (discountMatch) {
          const discount = parseInt(discountMatch[1]);
          if (discount > 0 && discount <= 100) {
            fieldToUpdate = 'discount';
            valueToSet = discount.toString();
            botResponse = `Excellent! ${discount}% discount it is. ✓\n\nWhen should this promotion start?\n\nPlease provide a date (e.g., "Dec 1, 2025" or "2025-12-01")`;
          } else {
            botResponse = `The discount should be between 1% and 100%. What percentage would you like?`;
          }
        } else {
          botResponse = `I need a number for the discount. For example: "25" or "30%"`;
        }
      } else if (!newPromotion.startDate) {
        // Step 5: Start Date
        // Simple date parsing - in production use a library
        const dateStr = input;
        fieldToUpdate = 'startDate';
        valueToSet = dateStr;
        botResponse = `Got it! Starting on ${dateStr}. ✓\n\nWhen should it end?\n\nPlease provide an end date (e.g., "Jan 31, 2026")`;
      } else if (!newPromotion.endDate) {
        // Step 6: End Date
        const dateStr = input;
        fieldToUpdate = 'endDate';
        valueToSet = dateStr;
        botResponse = `Perfect! Ending on ${dateStr}. ✓\n\n🎉 All done! Here's your new promotion:\n\n**${newPromotion.name}**\n• Products: ${newPromotion.products.join(', ')}\n• Target: ${newPromotion.cohort}\n• Discount: ${newPromotion.discount}%\n• Duration: ${newPromotion.startDate} to ${dateStr}\n\nType "create" to finalize, or "change [field]" to modify something.`;
      } else {
        // All fields complete - waiting for confirmation
        if (input.toLowerCase().includes('create') || input.toLowerCase().includes('yes') || input.toLowerCase().includes('confirm')) {
          botResponse = `🎉 Fantastic! "${newPromotion.name}" has been created and is ready for review. You'll find it in the scheduled promotions section.\n\nThe modal will close in a moment...`;
          setTimeout(() => {
            closeCreateModal();
          }, 3000);
        } else {
          botResponse = `Type "create" to finalize the promotion, or let me know what you'd like to change.`;
        }
      }

      // Update field if needed
      if (fieldToUpdate && valueToSet !== null) {
        updatePromotionField(fieldToUpdate, valueToSet);
      }

      setCreateMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse
      }]);
    }, 600);

    setCreateInput('');
  };

  const handleCreatePromotion = () => {
    const confirmMessage = {
      id: Date.now(),
      type: 'bot',
      content: `🎉 Excellent! I've created "${newPromotion.name}" and it's now ready for review. You can find it in the scheduled promotions section. Would you like to create another promotion or make any changes?`
    };
    
    setCreateMessages(prev => [...prev, confirmMessage]);
    
    // In a real app, you would save the promotion here
    setTimeout(() => {
      closeCreateModal();
    }, 3000);
  };

  const handleEndDateChange = () => {
    const botResponse = {
      id: Date.now(),
      type: 'bot',
      content: `Perfect! I've updated "${selectedPromotion.name}" to end on ${newEndDate}. The changes have been saved successfully. Is there anything else you'd like to modify?`
    };
    
    setModalMessages(prev => [...prev, botResponse]);
    
    // In a real app, you would update the promotion data here
    setTimeout(() => {
      const finalMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Great! Your changes are live. You can close this window or make additional changes.'
      };
      setModalMessages(prev => [...prev, finalMessage]);
    }, 1000);
  };

  const triggerAgentAction = (promotion, action) => {
    let message = '';
    
    switch(action) {
      case 'products':
        message = `I'd like to know about the products included in "${promotion.name}". Can you provide details?`;
        break;
      case 'cohort':
        message = `Where does the "${promotion.name}" promotion apply? Which cohorts are included?`;
        break;
      case 'discount':
        message = `What's the discount rate for "${promotion.name}"?`;
        break;
      case 'dates':
        if (promotion.status === 'scheduled') {
          message = `When does "${promotion.name}" start and end?`;
        } else {
          message = `When does the "${promotion.name}" promotion end?`;
        }
        break;
      case 'modify':
        message = `I'd like to modify the "${promotion.name}" promotion. What changes can I make?`;
        break;
      default:
        message = `Tell me more about "${promotion.name}".`;
    }

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: message
    };

    // Simulate bot response
    let botResponse = '';
    switch(action) {
      case 'products':
        botResponse = `The "${promotion.name}" promotion includes these products: ${promotion.products.join(', ')}. These products are currently performing well with a ${promotion.conversionRate} conversion rate.`;
        break;
      case 'cohort':
        botResponse = `"${promotion.name}" applies to the ${promotion.cohort} cohort. This promotion has generated ${promotion.revenueImpact} in revenue impact.`;
        break;
      case 'discount':
        botResponse = `"${promotion.name}" offers a ${promotion.discount}% discount. This discount is ${promotion.status === 'active' ? 'currently active' : 'scheduled to begin'}.`;
        break;
      case 'dates':
        if (promotion.status === 'scheduled') {
          botResponse = `"${promotion.name}" is scheduled to start on ${promotion.startDate} and end on ${promotion.endDate}.`;
        } else {
          botResponse = `"${promotion.name}" is currently active and will end on ${promotion.endDate}.`;
        }
        break;
      case 'modify':
        botResponse = `I can help you modify "${promotion.name}". You can update: the discount rate (currently ${promotion.discount}%), the end date (${promotion.endDate}), add/remove products, or change the target cohort. What would you like to change?`;
        break;
      default:
        botResponse = `"${promotion.name}" is a ${promotion.status} promotion offering ${promotion.discount}% off to ${promotion.cohort}. It's generating ${promotion.revenueImpact} with a ${promotion.conversionRate} conversion rate.`;
    }

    const botMsg = {
      id: Date.now() + 1,
      type: 'bot',
      content: botResponse
    };

    setChatMessages(prev => [...prev, userMsg, botMsg]);
    
    // Ensure chat is open
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-logo">Zesty ISP</h1>
        </div>
        <div className="header-right">
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div className="user-profile">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff" alt="User" />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'promotion' ? 'active' : ''}`}
          onClick={() => setActiveTab('promotion')}
        >
          Promotion management
        </button>
        <button
          className={`nav-tab ${activeTab === 'cohorts' ? 'active' : ''}`}
          onClick={() => setActiveTab('cohorts')}
        >
          Cohorts
        </button>
        <button
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar - Chat Agent */}
        <aside className={`dashboard-sidebar ${isChatOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3>A-OK Chat agent</h3>
            <button 
              className="sidebar-toggle"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
              </svg>
            </button>
          </div>
          
          {isChatOpen && (
            <div className="chat-content">
              <div className="chat-messages">
                {chatMessages.map((message) => (
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
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="chat-input-container">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="chat-input"
                />
                <button className="chat-send-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Action Window */}
        <section className="action-window">
          <div className="action-window-header">
            <h2>{activeTab === 'promotion' ? 'Promotion Management' : activeTab === 'cohorts' ? 'Cohorts' : 'Products'}</h2>
            {activeTab === 'promotion' && (
              <button className="primary-button" onClick={openCreateModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create promotion
              </button>
            )}
            {activeTab !== 'promotion' && (
              <button className="primary-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create New
              </button>
            )}
          </div>

          <div className="action-content">
            {activeTab === 'promotion' && (
              <div className="promotions-container">
                {/* Active Promotions Section */}
                <div className="promotions-section active-section">
                  <div className="section-header">
                    <div className="header-content">
                      <h3>Active Promotions</h3>
                      <span className="promotion-count">{promotions.filter(p => p.status === 'active').length} running</span>
                    </div>
                    <p className="section-subtitle">Sorted by end date - promotions ending soon appear first</p>
                  </div>

                  <div className="promotions-list">
                    {promotions
                      .filter(p => p.status === 'active')
                      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
                      .map((promotion) => (
                        <div 
                          key={promotion.id} 
                          className={`promotion-accordion ${expandedPromotions[promotion.id] ? 'expanded' : ''}`}
                        >
                      {/* Collapsed State */}
                      <div 
                        className="promotion-summary" 
                        onClick={() => togglePromotion(promotion.id)}
                      >
                        <div className="promotion-summary-left">
                          <div className="promotion-header-row">
                            <h4 className="promotion-name">{promotion.name}</h4>
                            <span className={`badge badge-${promotion.status}`}>
                              {promotion.status}
                            </span>
                          </div>
                          <div className="promotion-products">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                            <span>{promotion.products.join(' • ')}</span>
                          </div>
                        </div>
                        
                        <div className="promotion-summary-right">
                          <div className="promotion-dates-compact">
                            <div className="date-compact">
                              <span className="date-label">Start</span>
                              <span className="date-value">{promotion.startDate}</span>
                            </div>
                            <div className="date-separator">→</div>
                            <div className="date-compact">
                              <span className="date-label">End</span>
                              <span className="date-value">{promotion.endDate}</span>
                            </div>
                          </div>
                          {promotion.status === 'active' ? (
                            <>
                              <div className="promotion-metric">
                                <span className="metric-label">Revenue Impact</span>
                                <span className="metric-value">{promotion.revenueImpact}</span>
                              </div>
                              <div className="promotion-metric">
                                <span className="metric-label">Conversion Rate</span>
                                <span className="metric-value">{promotion.conversionRate}</span>
                              </div>
                            </>
                          ) : (
                            <div className="scheduled-notice">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <span>Starts {promotion.startDate}</span>
                            </div>
                          )}
                          <div className="expand-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Expanded State */}
                      {expandedPromotions[promotion.id] && (
                        <div className="promotion-details">
                          <div className="promotion-details-grid">
                            <div className="detail-card">
                              <div className="detail-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <span className="detail-label">Start Date</span>
                                <span className="detail-value">{promotion.startDate}</span>
                              </div>
                            </div>

                            <div className="detail-card">
                              <div className="detail-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <span className="detail-label">End Date</span>
                                <span className="detail-value">{promotion.endDate}</span>
                              </div>
                            </div>

                            <div className="detail-card">
                              <div className="detail-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M12 6v6l4 2"></path>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <span className="detail-label">Discount Rate</span>
                                <span className="detail-value">{promotion.discount}%</span>
                              </div>
                            </div>

                            <div className="detail-card">
                              <div className="detail-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                              </div>
                              <div className="detail-content">
                                <span className="detail-label">Target Cohort</span>
                                <span className="detail-value">{promotion.cohort}</span>
                              </div>
                            </div>
                          </div>

                          <div className="agent-actions">
                            <h5>Ask A-OK Agent About:</h5>
                            <div className="action-buttons">
                              <button 
                                className="agent-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(promotion, 'products');
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                                What products are included?
                              </button>
                              
                              <button 
                                className="agent-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(promotion, 'cohort');
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Where does it apply?
                              </button>
                              
                              <button 
                                className="agent-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(promotion, 'discount');
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M12 6v6l4 2"></path>
                                </svg>
                                What's the discount rate?
                              </button>
                              
                              <button 
                                className="agent-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(promotion, 'dates');
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {promotion.status === 'scheduled' ? 'When does it start/end?' : 'When does it end?'}
                              </button>
                              
                              <button 
                                className="agent-action-btn primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(promotion, 'modify');
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Modify this promotion
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                      ))}
                  </div>
                </div>

                {/* Scheduled Promotions Section */}
                <div className="promotions-section scheduled-section">
                  <div className="section-header">
                    <div className="header-content">
                      <h3>Scheduled Promotions</h3>
                      <span className="promotion-count">{promotions.filter(p => p.status === 'scheduled').length} upcoming</span>
                    </div>
                    <p className="section-subtitle">Promotions that will start in the future</p>
                  </div>

                  <div className="promotions-list">
                    {promotions
                      .filter(p => p.status === 'scheduled')
                      .map((promotion) => (
                        <div 
                          key={promotion.id} 
                          className={`promotion-accordion ${expandedPromotions[promotion.id] ? 'expanded' : ''}`}
                        >
                          {/* Collapsed State */}
                          <div 
                            className="promotion-summary" 
                            onClick={() => togglePromotion(promotion.id)}
                          >
                            <div className="promotion-summary-left">
                              <div className="promotion-header-row">
                                <h4 className="promotion-name">{promotion.name}</h4>
                                <span className={`badge badge-${promotion.status}`}>
                                  {promotion.status}
                                </span>
                              </div>
                              <div className="promotion-products">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                                <span>{promotion.products.join(' • ')}</span>
                              </div>
                            </div>
                            
                            <div className="promotion-summary-right">
                              <div className="promotion-dates-compact">
                                <div className="date-compact">
                                  <span className="date-label">Start</span>
                                  <span className="date-value">{promotion.startDate}</span>
                                </div>
                                <div className="date-separator">→</div>
                                <div className="date-compact">
                                  <span className="date-label">End</span>
                                  <span className="date-value">{promotion.endDate}</span>
                                </div>
                              </div>
                              {promotion.status === 'active' ? (
                                <>
                                  <div className="promotion-metric">
                                    <span className="metric-label">Revenue Impact</span>
                                    <span className="metric-value">{promotion.revenueImpact}</span>
                                  </div>
                                  <div className="promotion-metric">
                                    <span className="metric-label">Conversion Rate</span>
                                    <span className="metric-value">{promotion.conversionRate}</span>
                                  </div>
                                </>
                              ) : (
                                <div className="scheduled-notice">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  <span>Starts {promotion.startDate}</span>
                                </div>
                              )}
                              <div className="expand-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Expanded State */}
                          {expandedPromotions[promotion.id] && (
                            <div className="promotion-details">
                              <div className="promotion-details-grid">
                                <div className="detail-card">
                                  <div className="detail-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                      <line x1="16" y1="2" x2="16" y2="6"></line>
                                      <line x1="8" y1="2" x2="8" y2="6"></line>
                                      <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                  </div>
                                  <div className="detail-content">
                                    <span className="detail-label">Start Date</span>
                                    <span className="detail-value">{promotion.startDate}</span>
                                  </div>
                                </div>

                                <div className="detail-card">
                                  <div className="detail-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                      <line x1="16" y1="2" x2="16" y2="6"></line>
                                      <line x1="8" y1="2" x2="8" y2="6"></line>
                                      <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                  </div>
                                  <div className="detail-content">
                                    <span className="detail-label">End Date</span>
                                    <span className="detail-value">{promotion.endDate}</span>
                                  </div>
                                </div>

                                <div className="detail-card">
                                  <div className="detail-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M12 6v6l4 2"></path>
                                    </svg>
                                  </div>
                                  <div className="detail-content">
                                    <span className="detail-label">Discount Rate</span>
                                    <span className="detail-value">{promotion.discount}%</span>
                                  </div>
                                </div>

                                <div className="detail-card">
                                  <div className="detail-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="9" cy="7" r="4"></circle>
                                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                  </div>
                                  <div className="detail-content">
                                    <span className="detail-label">Target Cohort</span>
                                    <span className="detail-value">{promotion.cohort}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="agent-actions">
                                <h5>Ask A-OK Agent About:</h5>
                                <div className="action-buttons">
                                  <button 
                                    className="agent-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerAgentAction(promotion, 'products');
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    </svg>
                                    What products are included?
                                  </button>
                                  
                                  <button 
                                    className="agent-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerAgentAction(promotion, 'cohort');
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="9" cy="7" r="4"></circle>
                                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    Where does it apply?
                                  </button>
                                  
                                  <button 
                                    className="agent-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerAgentAction(promotion, 'discount');
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M12 6v6l4 2"></path>
                                    </svg>
                                    What's the discount rate?
                                  </button>
                                  
                                  <button 
                                    className="agent-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerAgentAction(promotion, 'dates');
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                      <line x1="16" y1="2" x2="16" y2="6"></line>
                                      <line x1="8" y1="2" x2="8" y2="6"></line>
                                      <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    {promotion.status === 'scheduled' ? 'When does it start/end?' : 'When does it end?'}
                                  </button>
                                  
                                  <button 
                                    className="agent-action-btn primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerAgentAction(promotion, 'modify');
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Modify this promotion
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cohorts' && (
              <div className="cohorts-container">
                <div className="cohorts-list">
                  {cohorts
                    .sort((a, b) => b.estimatedPeople - a.estimatedPeople)
                    .map((cohort) => (
                      <div key={cohort.id} className="cohort-row">
                        <div className="cohort-row-left">
                          <div className="cohort-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <div className="cohort-info">
                            <h3 className="cohort-name">{cohort.name}</h3>
                            <p className="cohort-description">{cohort.description}</p>
                          </div>
                        </div>
                        
                        <div className="cohort-row-right">
                          <div className="cohort-metric">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <div className="metric-content">
                              <span className="metric-label">Zip Code</span>
                              <span className="metric-value">{cohort.zip}</span>
                            </div>
                          </div>
                          
                          <div className="cohort-metric">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <div className="metric-content">
                              <span className="metric-label">Est. People</span>
                              <span className="metric-value">{cohort.estimatedPeople.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <button className="cohort-action-button">
                            View Details
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-container">
                <div className="products-list">
                  {products.map((product) => (
                    <div key={product.id} className="product-row">
                      <div className="product-row-left">
                        <div className="product-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          </svg>
                        </div>
                        <div className="product-info">
                          <div className="product-header-info">
                            <h3 className="product-name">{product.name}</h3>
                            <span className={`badge badge-${product.type.toLowerCase()}`}>
                              {product.type}
                            </span>
                          </div>
                          <p className="product-description">{product.description}</p>
                          <div className="product-features">
                            {product.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="feature-tag">
                                {feature}
                              </span>
                            ))}
                            {product.features.length > 2 && (
                              <span className="feature-tag more">+{product.features.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="product-row-right">
                        <div className="product-metric">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                          </svg>
                          <div className="metric-content">
                            <span className="metric-label">Speed</span>
                            <span className="metric-value">{product.speed}</span>
                          </div>
                        </div>
                        
                        <div className="product-metric">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          <div className="metric-content">
                            <span className="metric-label">Price</span>
                            <span className="metric-value">${product.price}/mo</span>
                          </div>
                        </div>
                        
                        <button className="product-action-button">
                          Edit Product
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create Promotion Modal - Larger */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={closeCreateModal}>
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
              <button className="modal-close" onClick={closeCreateModal}>
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
                    <div className={`checklist-item-large ${completedFields.includes('name') ? 'completed' : completedFields.length === 0 ? 'active' : ''}`}>
                      <div className="checklist-icon-large">
                        {completedFields.includes('name') ? '✓' : '1'}
                      </div>
                      <div className="checklist-content">
                        <span className="checklist-title">Promotion Name</span>
                        {newPromotion.name && <span className="checklist-value">{newPromotion.name}</span>}
                      </div>
                      {completedFields.includes('name') && (
                        <button 
                          className="edit-task-button"
                          onClick={() => handleEditTask('name')}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className={`checklist-item-large ${completedFields.includes('products') ? 'completed' : completedFields.includes('name') && !completedFields.includes('products') ? 'active' : ''}`}>
                      <div className="checklist-icon-large">
                        {completedFields.includes('products') ? '✓' : '2'}
                      </div>
                      <div className="checklist-content">
                        <span className="checklist-title">Products</span>
                        {newPromotion.products.length > 0 && <span className="checklist-value">{newPromotion.products.length} selected</span>}
                      </div>
                      {completedFields.includes('products') && (
                        <button 
                          className="edit-task-button"
                          onClick={() => handleEditTask('products')}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className={`checklist-item-large ${completedFields.includes('cohort') ? 'completed' : completedFields.includes('products') && !completedFields.includes('cohort') ? 'active' : ''}`}>
                      <div className="checklist-icon-large">
                        {completedFields.includes('cohort') ? '✓' : '3'}
                      </div>
                      <div className="checklist-content">
                        <span className="checklist-title">Target Cohort</span>
                        {newPromotion.cohort && <span className="checklist-value">{newPromotion.cohort}</span>}
                      </div>
                      {completedFields.includes('cohort') && (
                        <button 
                          className="edit-task-button"
                          onClick={() => handleEditTask('cohort')}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className={`checklist-item-large ${completedFields.includes('discount') ? 'completed' : completedFields.includes('cohort') && !completedFields.includes('discount') ? 'active' : ''}`}>
                      <div className="checklist-icon-large">
                        {completedFields.includes('discount') ? '✓' : '4'}
                      </div>
                      <div className="checklist-content">
                        <span className="checklist-title">Discount Rate</span>
                        {newPromotion.discount && <span className="checklist-value">{newPromotion.discount}%</span>}
                      </div>
                      {completedFields.includes('discount') && (
                        <button 
                          className="edit-task-button"
                          onClick={() => handleEditTask('discount')}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className={`checklist-item-large ${completedFields.includes('startDate') ? 'completed' : completedFields.includes('discount') && !completedFields.includes('startDate') ? 'active' : ''}`}>
                      <div className="checklist-icon-large">
                        {completedFields.includes('startDate') ? '✓' : '5'}
                      </div>
                      <div className="checklist-content">
                        <span className="checklist-title">Start Date</span>
                        {newPromotion.startDate && <span className="checklist-value">{newPromotion.startDate}</span>}
                      </div>
                      {completedFields.includes('startDate') && (
                        <button 
                          className="edit-task-button"
                          onClick={() => handleEditTask('startDate')}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className={`checklist-item-large ${completedFields.includes('endDate') ? 'completed' : completedFields.includes('startDate') && !completedFields.includes('endDate') ? 'active' : ''}`}>
                      <div className="checklist-icon-large">
                        {completedFields.includes('endDate') ? '✓' : '6'}
                      </div>
                      <div className="checklist-content">
                        <span className="checklist-title">End Date</span>
                        {newPromotion.endDate && <span className="checklist-value">{newPromotion.endDate}</span>}
                      </div>
                      {completedFields.includes('endDate') && (
                        <button 
                          className="edit-task-button"
                          onClick={() => handleEditTask('endDate')}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side - Conversation */}
                <div className="create-conversation">
                  <div className="modal-messages">
                    {createMessages.map((message) => {
                      const showProducts = message.content.includes('[SHOW_PRODUCTS]');
                      const showCohorts = message.content.includes('[SHOW_COHORTS]');
                      let cleanContent = message.content.replace('[SHOW_PRODUCTS]', '').replace('[SHOW_COHORTS]', '');
                      
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
                          
                          {/* Product Selection Buttons */}
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
                          
                          {/* Cohort Selection Buttons */}
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
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <input
                type="text"
                placeholder="Ask A-OK for help or guidance..."
                value={createInput}
                onChange={(e) => setCreateInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendCreateMessage()}
                className="modal-input"
              />
              <button
                className="modal-send-button"
                onClick={sendCreateMessage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A-OK Agent Modal */}
      {modalOpen && selectedPromotion && (
        <div className="modal-overlay" onClick={closeModal}>
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
                  <p className="modal-subtitle">{selectedPromotion.name}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-messages">
                {modalMessages.map((message) => (
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

              {/* Special UI for End Date Modification */}
              {modalAction === 'modify' && modalMessages.some(m => m.content.toLowerCase().includes('end date') && m.type === 'bot') && (
                <div className="modal-action-panel">
                  <div className="action-panel-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <h4>Change End Date</h4>
                  </div>
                  <div className="action-panel-content">
                    <div className="form-group">
                      <label>Current End Date</label>
                      <input type="text" value={selectedPromotion.endDate} disabled />
                    </div>
                    <div className="form-group">
                      <label>New End Date</label>
                      <input 
                        type="date" 
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        className="date-input"
                      />
                    </div>
                    <button 
                      className="action-panel-button"
                      onClick={handleEndDateChange}
                    >
                      Update End Date
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <input
                type="text"
                placeholder="Type your message..."
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendModalMessage()}
                className="modal-input"
              />
              <button 
                className="modal-send-button"
                onClick={sendModalMessage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

