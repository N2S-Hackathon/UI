import { useState, useCallback, useMemo, lazy, Suspense, useEffect, useRef } from 'react';
import { fetchProducts, fetchCohorts, fetchPromotions, getActiveConversation, commitStagedPromotions } from '../services/api';
import { useConversation } from '../hooks/useConversation';
import PromotionCard from '../components/PromotionCard';
import ProductCard from '../components/ProductCard';
import CohortCard from '../components/CohortCard';
import ChatSidebar from '../components/ChatSidebar';
import './Dashboard.css';

// Lazy load modals - they're not needed until user opens them
const CreatePromotionModal = lazy(() => import('../components/CreatePromotionModal'));
const AgentModal = lazy(() => import('../components/AgentModal'));

function Dashboard() {
  const [activeTab, setActiveTab] = useState('promotion');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [expandedPromotions, setExpandedPromotions] = useState({});
  const [expandedCohorts, setExpandedCohorts] = useState({});
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Welcome to Zesty ISP! I'm A-ok, your AI assistant."
    },
    {
      id: 2,
      type: 'bot',
      content: "Let me load your dashboard data..."
    }
  ]);
  const [isAokTyping, setIsAokTyping] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Conversation management with polling
  const conversation = useConversation();
  const [modalAction, setModalAction] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // API data states
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedData = useRef(false);

  // Helper to add A-ok message
  const addAokMessage = useCallback((content, actions = null) => {
    setChatMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: 'bot',
      content,
      actions
    }]);
  }, []);

  // Auto-reload promotions when conversation completes
  useEffect(() => {
    // When a conversation turn completes, reload promotions to get latest data
    // Only run if products are loaded (to avoid dependency issues)
    if (conversation.status === 'completed' && conversation.latestTurn && products.length > 0) {
      const reloadData = async () => {
        console.log('Conversation completed, reloading promotions...');
        try {
          const promotionsData = await fetchPromotions();
          
          // Enrich promotions with product names
          const enrichedPromotions = promotionsData.map(promo => {
            if (promo.productId) {
              const promoProductId = Number(promo.productId);
              const product = products.find(p => Number(p.id) === promoProductId);
              return {
                ...promo,
                products: product ? [product.name] : ['Unknown Product']
              };
            }
            return promo;
          });
          
          setPromotions(enrichedPromotions);
          addAokMessage("✅ Changes applied! The promotions list has been updated.");
        } catch (err) {
          console.error('Failed to reload promotions:', err);
        }
      };
      
      // Delay slightly to allow backend to process
      const timeoutId = setTimeout(reloadData, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [conversation.status, conversation.latestTurn, products, addAokMessage]);

  // Load data from API on component mount with progressive updates
  useEffect(() => {
    // Prevent double execution (React Strict Mode in dev runs effects twice)
    if (hasLoadedData.current) return;
    hasLoadedData.current = true;
    
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setIsAokTyping(true);
      
      try {
        // Show typing indicator briefly
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load products first
        addAokMessage("📦 Fetching your product catalog...");
        setIsAokTyping(true);
        const productsData = await fetchProducts();
        console.log('Loaded products:', productsData.map(p => ({ id: p.id, name: p.name })));
        setProducts(productsData);
        await new Promise(resolve => setTimeout(resolve, 400));
        addAokMessage(`✓ Found ${productsData.length} products available`);
        
        // Load cohorts
        setIsAokTyping(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        addAokMessage("👥 Loading customer cohorts...");
        const cohortsData = await fetchCohorts();
        setCohorts(cohortsData);
        await new Promise(resolve => setTimeout(resolve, 400));
        addAokMessage(`✓ Loaded ${cohortsData.length} customer segments`);
        
        // Load promotions
        setIsAokTyping(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        addAokMessage("📊 Retrieving promotional campaigns...");
        const promotionsData = await fetchPromotions();
        
        // Enrich promotions with product names by looking up productId
        const enrichedPromotions = promotionsData.map(promo => {
          if (promo.productId) {
            // Convert to number for comparison (API might return string or number)
            const promoProductId = Number(promo.productId);
            const product = productsData.find(p => Number(p.id) === promoProductId);
            console.log('Enriching promotion:', {
              promoId: promo.id,
              promoName: promo.name,
              productId: promo.productId,
              productIdType: typeof promo.productId,
              promoProductIdNumber: promoProductId,
              availableProductIds: productsData.map(p => ({ id: p.id, type: typeof p.id })),
              foundProduct: product,
              productName: product?.name
            });
            return {
              ...promo,
              products: product ? [product.name] : ['Unknown Product']
            };
          }
          console.log('No productId for promotion:', promo.name);
          return promo;
        });
        
        setPromotions(enrichedPromotions);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const pendingCount = enrichedPromotions.filter(p => p.status === 'pending').length;
        const activeCount = enrichedPromotions.filter(p => p.status === 'active').length;
        
        addAokMessage(`✓ Loaded ${enrichedPromotions.length} promotions (${activeCount} active, ${pendingCount} pending review)`);
        
        // Check for existing active conversation
        setIsAokTyping(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        addAokMessage("🔍 Checking for active conversations...");
        
        try {
          const activeConversation = await getActiveConversation();
          
          if (activeConversation && activeConversation.turns && activeConversation.turns.length > 0) {
            addAokMessage(`✓ Found active conversation with ${activeConversation.turns.length} turn${activeConversation.turns.length > 1 ? 's' : ''}`);
            console.log('Active conversation loaded:', activeConversation);
            // The conversation hook will handle displaying the turns
          } else {
            addAokMessage("✓ No active conversations found");
          }
        } catch (err) {
          // No active conversation is not an error - it's expected for new sessions
          console.log('No active conversation or error checking:', err.message);
          addAokMessage("✓ Starting fresh - no active conversations");
        }
        
        // Build CTAs dynamically based on data
        const quickActions = [
          {
            label: 'Create New Promotion',
            icon: '➕',
            action: 'create_promotion',
            style: 'primary'
          }
        ];
        
        // Add pending review CTA if there are pending promotions
        if (pendingCount > 0) {
          quickActions.push({
            label: `Review ${pendingCount} Pending Promotion${pendingCount > 1 ? 's' : ''}`,
            icon: '📋',
            action: 'view_pending',
            style: 'secondary'
          });
        }
        
        // Final welcome message with CTAs
        setIsAokTyping(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsAokTyping(false);
        addAokMessage(
          "🎉 All set! Here's what you can do:\n\n📊 **Promotion Management** - Create, review, and manage offers\n👥 **Cohorts** - View customer segments and demographics\n📦 **Products** - Browse internet service products\n\nQuick actions:",
          quickActions
        );
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load data. Using cached information.');
        setIsAokTyping(false);
        addAokMessage("⚠️ I encountered an issue loading some data, but I'm showing you what I have cached. Everything should still work!");
      } finally {
        setIsLoading(false);
        setIsAokTyping(false);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized filtered and sorted promotions
  // Promotions for Review: Show promotions with pending staging records from API
  const pendingPromotions = useMemo(() => 
    promotions.filter(p => p.hasPendingChanges === true),
    [promotions]
  );

  const activePromotions = useMemo(() => 
    promotions
      .filter(p => p.status === 'active')
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate)),
    [promotions]
  );

  const scheduledPromotions = useMemo(() => 
    promotions.filter(p => p.status === 'scheduled'),
    [promotions]
  );

  const sortedCohorts = useMemo(() =>
    [...cohorts].sort((a, b) => b.estimatedPeople - a.estimatedPeople),
    [cohorts]
  );

  // Memoized callbacks
  const togglePromotion = useCallback((promotionId) => {
    setExpandedPromotions(prev => ({
      ...prev,
      [promotionId]: !prev[promotionId]
    }));
  }, []);

  const toggleCohort = useCallback((cohortId) => {
    setExpandedCohorts(prev => ({
      ...prev,
      [cohortId]: !prev[cohortId]
    }));
  }, []);

  const openModal = useCallback((item, action) => {
    // Check if it's a cohort or promotion based on properties
    if (item.estimatedPeople !== undefined) {
      // It's a cohort
      setSelectedCohort(item);
      setSelectedPromotion(null);
    } else {
      // It's a promotion
      setSelectedPromotion(item);
      setSelectedCohort(null);
    }
    setModalAction(action);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalAction(null);
    setSelectedPromotion(null);
    setSelectedCohort(null);
  }, []);

  const openCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    
    // Determine if this is a new conversation or continuation
    const isNewConversation = !conversation.conversationId || conversation.status === 'idle';
    
    if (isNewConversation) {
      // Start new conversation with context path
      const success = await conversation.startConversation('/promotion-management', message);
      
      if (success) {
        addAokMessage("🔄 Processing your request...");
      } else if (conversation.error) {
        // Error handled by conversation hook, will display in ChatSidebar
        console.error('Failed to start conversation:', conversation.error);
      }
    } else {
      // Add turn to existing conversation
      const success = await conversation.addTurn(message);
      
      if (success) {
        addAokMessage("🔄 Processing your request...");
      } else if (conversation.error) {
        // Error handled by conversation hook
        console.error('Failed to add turn:', conversation.error);
      }
    }
  }, [conversation, addAokMessage]);

  const handleCTAClick = useCallback((action) => {
    switch (action) {
      case 'create_promotion':
        // Use conversation API to create promotions through A-OK
        // Build suggestions from actual data
        let suggestions = "Great! Let me help you create a new promotion. Tell me what you'd like to create.";
        
        if (products.length > 0 || cohorts.length > 0) {
          suggestions += "\n\nHere's what I know about:";
          
          if (products.length > 0) {
            const productNames = products.slice(0, 3).map(p => p.name).join(', ');
            suggestions += `\n• **Products:** ${productNames}${products.length > 3 ? `, and ${products.length - 3} more` : ''}`;
          }
          
          if (cohorts.length > 0) {
            const cohortNames = cohorts.slice(0, 3).map(c => c.name).join(', ');
            suggestions += `\n• **Customer Segments:** ${cohortNames}${cohorts.length > 3 ? `, and ${cohorts.length - 3} more` : ''}`;
          }
          
          suggestions += "\n\nDescribe the promotion you'd like to create, and I'll set it up! 🚀";
        } else {
          suggestions += " Just describe what you'd like and I'll help you set it up! 🚀";
        }
        
        addAokMessage(suggestions);
        break;
      case 'view_pending':
        setActiveTab('promotion');
        // Scroll to pending promotions section
        setTimeout(() => {
          const pendingSection = document.querySelector('.review-section');
          if (pendingSection) {
            pendingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        addAokMessage("Showing you the promotions with pending changes that need review. These are staging records waiting to be committed to production. 📋");
        break;
      default:
        console.log('Unknown CTA action:', action);
    }
  }, [addAokMessage, products, cohorts, setActiveTab]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Handle committing staging records to production
  const handleCommitChanges = useCallback(async () => {
    try {
      addAokMessage("🔄 Committing pending changes to production...");
      
      await commitStagedPromotions();
      
      // Reload promotions to reflect changes
      const promotionsData = await fetchPromotions();
      
      // Enrich promotions with product names
      const enrichedPromotions = promotionsData.map(promo => {
        if (promo.productId) {
          const promoProductId = Number(promo.productId);
          const product = products.find(p => Number(p.id) === promoProductId);
          return {
            ...promo,
            products: product ? [product.name] : ['Unknown Product']
          };
        }
        return promo;
      });
      
      setPromotions(enrichedPromotions);
      
      addAokMessage("✅ Successfully committed all pending changes to production! Promotions have been updated.");
      
    } catch (err) {
      console.error('Failed to commit staged promotions:', err);
      addAokMessage("⚠️ Failed to commit changes. Please try again or contact support.");
    }
  }, [products, addAokMessage]);

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
          onClick={() => handleTabChange('promotion')}
        >
          Promotion management
        </button>
        <button
          className={`nav-tab ${activeTab === 'cohorts' ? 'active' : ''}`}
          onClick={() => handleTabChange('cohorts')}
        >
          Cohorts
        </button>
        <button
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleTabChange('products')}
        >
          Products
        </button>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar - Chat Agent */}
        <ChatSidebar 
          isOpen={isChatOpen} 
          onToggle={toggleChat} 
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isTyping={isAokTyping}
          onCTAClick={handleCTAClick}
          conversationTurns={conversation.turns}
          isProcessing={conversation.isProcessing}
          canSendMessage={conversation.canSendMessage}
          error={conversation.error}
        />

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
            {/* Loading State */}
            {isLoading && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px',
                fontSize: '18px',
                color: '#666'
              }}>
                Loading data...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffc107',
                borderRadius: '8px',
                margin: '20px',
                color: '#856404'
              }}>
                {error}
              </div>
            )}

            {/* Content - Only show when not loading */}
            {!isLoading && activeTab === 'promotion' && (
              <div className="promotions-container">
                {/* Promotions for Review Section - Always show title */}
                <div className="promotions-section review-section">
                  <div className="section-header">
                    <div className="header-content">
                      <h3>Promotions for Review</h3>
                      {pendingPromotions.length > 0 && (
                        <span className="promotion-count review-count">{pendingPromotions.length} pending</span>
                      )}
                    </div>
                    <p className="section-subtitle">New promotions awaiting approval before scheduling</p>
                  </div>

                  {pendingPromotions.length > 0 ? (
                    <div className="promotions-list">
                      {pendingPromotions.map((promotion) => (
                        <PromotionCard
                          key={promotion.id} 
                          promotion={promotion}
                          isExpanded={!!expandedPromotions[promotion.id]}
                          onToggle={() => togglePromotion(promotion.id)}
                          onOpenModal={openModal}
                          onCommitChanges={handleCommitChanges}
                        />
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No promotions pending review yet.
                    </div>
                  )}
                </div>

                {/* Active Promotions Section */}
                <div className="promotions-section active-section">
                  <div className="section-header">
                    <div className="header-content">
                      <h3>Active Promotions</h3>
                      <span className="promotion-count">{activePromotions.length} running</span>
                              </div>
                    <p className="section-subtitle">Sorted by end date - promotions ending soon appear first</p>
                            </div>

                  <div className="promotions-list">
                    {activePromotions.map((promotion) => (
                      <PromotionCard
                        key={promotion.id}
                        promotion={promotion}
                        isExpanded={!!expandedPromotions[promotion.id]}
                        onToggle={() => togglePromotion(promotion.id)}
                        onOpenModal={openModal}
                        onCommitChanges={handleCommitChanges}
                      />
                      ))}
                  </div>
                </div>

                {/* Scheduled Promotions Section */}
                <div className="promotions-section scheduled-section">
                  <div className="section-header">
                    <div className="header-content">
                      <h3>Scheduled Promotions</h3>
                      <span className="promotion-count">{scheduledPromotions.length} upcoming</span>
                    </div>
                    <p className="section-subtitle">Promotions that will start in the future</p>
                  </div>

                  <div className="promotions-list">
                    {scheduledPromotions.map((promotion) => (
                      <PromotionCard
                          key={promotion.id} 
                        promotion={promotion}
                        isExpanded={!!expandedPromotions[promotion.id]}
                        onToggle={() => togglePromotion(promotion.id)}
                        onOpenModal={openModal}
                        onCommitChanges={handleCommitChanges}
                      />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {!isLoading && activeTab === 'cohorts' && (
              <div className="cohorts-container">
                <div className="cohorts-list">
                  {sortedCohorts.map((cohort) => {
                    // Find active promotions targeting this cohort
                    const cohortPromotions = activePromotions.filter(
                      p => p.cohort === cohort.name || p.cohort === 'All Customers'
                    );
                    
                    return (
                      <CohortCard 
                        key={cohort.id} 
                        cohort={cohort}
                        isExpanded={!!expandedCohorts[cohort.id]}
                        onToggle={() => toggleCohort(cohort.id)}
                        onOpenModal={openModal}
                        activePromotions={cohortPromotions}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {!isLoading && activeTab === 'products' && (
              <div className="products-container">
                <div className="products-list">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lazy-loaded Modals */}
      <Suspense fallback={null}>
      {createModalOpen && (
          <CreatePromotionModal 
            isOpen={createModalOpen}
            onClose={closeCreateModal}
            products={products}
            cohorts={cohorts}
            onSubmit={async (promotionData) => {
              // Send promotion data through conversation API
              const prompt = `Create a new promotion with the following details:\n` +
                `Name: ${promotionData.name}\n` +
                `Products: ${Array.isArray(promotionData.products) ? promotionData.products.join(', ') : promotionData.products}\n` +
                `Target Cohort: ${promotionData.cohort}\n` +
                `Discount: $${promotionData.discountAmount} off for ${promotionData.discountTerm} month${promotionData.discountTerm > 1 ? 's' : ''}\n` +
                `Start Date: ${promotionData.startDate}\n` +
                `End Date: ${promotionData.endDate}`;
              
              closeCreateModal();
              
              // Add user message showing what they're creating
              addAokMessage(`📝 Creating promotion: ${promotionData.name}`);
              
              // Send to conversation API
              await handleSendMessage(prompt);
            }}
          />
        )}
        
      {modalOpen && (selectedPromotion || selectedCohort) && (
          <AgentModal
            isOpen={modalOpen}
            onClose={closeModal}
            promotion={selectedPromotion}
            cohort={selectedCohort}
            action={modalAction}
          />
        )}
      </Suspense>
    </div>
  );
}

export default Dashboard;

