import { useState, useCallback, useMemo, lazy, Suspense, useEffect, useRef } from 'react';
import { fetchProducts, fetchCohorts, fetchPromotions } from '../services/api';
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
  const [modalAction, setModalAction] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingPromotionData, setPendingPromotionData] = useState(null);
  
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
        setPromotions(promotionsData);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const pendingCount = promotionsData.filter(p => p.status === 'pending').length;
        const activeCount = promotionsData.filter(p => p.status === 'active').length;
        
        addAokMessage(`✓ Loaded ${promotionsData.length} promotions (${activeCount} active, ${pendingCount} pending review)`);
        
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
  const pendingPromotions = useMemo(() => 
    promotions.filter(p => p.status === 'pending'),
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

  const handleSendMessage = useCallback((message) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsAokTyping(true);
    
    // Simulate bot response (you can integrate with the conversation API here)
    setTimeout(() => {
      setIsAokTyping(false);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I received your message! I'm ready to help you with your ISP operations. This chat will be fully functional once connected to the conversation API."
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1200);
  }, []);

  const handleCTAClick = useCallback((action) => {
    switch (action) {
      case 'create_promotion':
        openCreateModal();
        addAokMessage("Great! Opening the promotion creation form for you. Fill in the details and I'll help you launch your new campaign! 🚀");
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
        addAokMessage("Showing you the pending promotions that need review. Click on any promotion to see details or take action. 📋");
        break;
      case 'submit_promotion':
        if (pendingPromotionData) {
          // Add the promotion to the promotions list
          setPromotions(prev => [...prev, pendingPromotionData]);
          setPendingPromotionData(null);
          
          // Switch to promotions tab and scroll to review section
          setActiveTab('promotion');
          
          // Add success message
          addAokMessage(`✅ Excellent! Your promotion **${pendingPromotionData.name}** has been submitted and is now in the "Promotions for Review" section below.`);
          
          // Scroll to the review section after a brief delay
          setTimeout(() => {
            const pendingSection = document.querySelector('.review-section');
            if (pendingSection) {
              pendingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
        break;
      default:
        console.log('Unknown CTA action:', action);
    }
  }, [openCreateModal, addAokMessage, pendingPromotionData]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleSubmitPromotion = useCallback((newPromotion) => {
    // Store the pending promotion data but don't add to promotions yet
    setPendingPromotionData(newPromotion);
    
    // Add A-ok message with the promotion details and Submit CTA
    const summaryMessage = `🎉 Perfect! I've prepared your new promotion prompt: **${newPromotion.name}**\n\n` +
      `Here's what you've configured:\n\n` +
      `**Products:** ${Array.isArray(newPromotion.products) ? newPromotion.products.join(', ') : newPromotion.products}\n` +
      `**Target Audience:** ${newPromotion.cohort}\n` +
      `**Discount:** ${newPromotion.discount}% off\n` +
      `**Start Date:** ${newPromotion.startDate}\n` +
      `**End Date:** ${newPromotion.endDate}\n\n` +
      `Review the details above and click Submit to add this promotion for review.`;
    
    addAokMessage(summaryMessage, [
      {
        label: 'Submit',
        icon: '✓',
        action: 'submit_promotion',
        style: 'primary'
      }
    ]);
  }, [addAokMessage]);

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
            onSubmit={handleSubmitPromotion}
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

