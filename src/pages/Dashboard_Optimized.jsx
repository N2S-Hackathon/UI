import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { PRODUCTS_DATA, COHORTS_DATA, PROMOTIONS_DATA } from '../data/staticData';
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
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Memoized data
  const products = useMemo(() => PRODUCTS_DATA, []);
  const cohorts = useMemo(() => COHORTS_DATA, []);
  const promotions = useMemo(() => PROMOTIONS_DATA, []);

  // Memoized filtered and sorted promotions
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

  const openModal = useCallback((promotion, action) => {
    setSelectedPromotion(promotion);
    setModalAction(action);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalAction(null);
    setSelectedPromotion(null);
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

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

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
            {activeTab === 'promotion' && (
              <div className="promotions-container">
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

            {activeTab === 'cohorts' && (
              <div className="cohorts-container">
                <div className="cohorts-list">
                  {sortedCohorts.map((cohort) => (
                    <CohortCard key={cohort.id} cohort={cohort} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
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
          />
        )}
        
        {modalOpen && selectedPromotion && (
          <AgentModal
            isOpen={modalOpen}
            onClose={closeModal}
            promotion={selectedPromotion}
            action={modalAction}
          />
        )}
      </Suspense>
    </div>
  );
}

export default Dashboard;

