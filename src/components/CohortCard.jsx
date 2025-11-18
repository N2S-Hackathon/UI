import { memo } from 'react';

const CohortCard = memo(({ 
  cohort, 
  isExpanded, 
  onToggle, 
  onOpenModal,
  activePromotions = [] // Promotions targeting this cohort
}) => {
  // Calculate totals from zip codes
  const totalZipCodes = cohort.zipCodes.length;
  const totalProspectCustomers = cohort.zipCodes.reduce((sum, zip) => sum + zip.prospectCustomers, 0);
  const totalExistingCustomers = cohort.zipCodes.reduce((sum, zip) => sum + zip.existingCustomers, 0);
  
  // Calculate mock metrics based on cohort data
  const engagementRate = Math.min(95, Math.floor((cohort.estimatedPeople / 100) + 45));
  const avgRevenue = Math.floor((cohort.estimatedPeople / 50) + 45);
  const churnRisk = cohort.name.includes('At-Risk') ? 'High' : 
                    cohort.name.includes('Long-term') ? 'Low' : 'Medium';
  const conversionRate = cohort.name.includes('First-time') ? 78 : 
                         cohort.name.includes('New') ? 65 : 54;
  
  return (
    <div className={`promotion-accordion ${isExpanded ? 'expanded' : ''}`}>
      {/* Collapsed State */}
      <div className="promotion-summary" onClick={onToggle}>
        <div className="promotion-summary-left">
          <div className="promotion-header-row">
            <h4 className="promotion-name">{cohort.name}</h4>
            <span className={`badge badge-cohort`}>
              {cohort.estimatedPeople.toLocaleString()} people
            </span>
          </div>
          <div className="promotion-products">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z"></path>
              <path d="M3 9h18"></path>
              <path d="M9 21V9"></path>
            </svg>
            <span>{cohort.description}</span>
          </div>
        </div>
        
        <div className="promotion-summary-right">
          <div className="promotion-cohort">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{totalZipCodes} Zip Code{totalZipCodes > 1 ? 's' : ''}</span>
          </div>
          <div className="promotion-dates-compact">
            <div className="date-compact">
              <span className="date-label">Prospect</span>
              <span className="date-value">{totalProspectCustomers.toLocaleString()}</span>
            </div>
            <div className="date-separator">•</div>
            <div className="date-compact">
              <span className="date-label">Existing</span>
              <span className="date-value">{totalExistingCustomers.toLocaleString()}</span>
            </div>
          </div>
          <div className="expand-icon">
            <span className="expand-text">view details</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded State */}
      {isExpanded && (
        <div className="promotion-details">
          {/* Zip Code Breakdown Table */}
          <div className="rates-table-container">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>Zip Code</th>
                  <th>Prospect Customers</th>
                  <th>Existing Customers</th>
                  <th>Total Customers</th>
                  <th>Prospect %</th>
                  <th>Existing %</th>
                </tr>
              </thead>
              <tbody>
                {cohort.zipCodes.map((zipData, index) => {
                  const total = zipData.prospectCustomers + zipData.existingCustomers;
                  const prospectPercent = total > 0 ? ((zipData.prospectCustomers / total) * 100).toFixed(1) : 0;
                  const existingPercent = total > 0 ? ((zipData.existingCustomers / total) * 100).toFixed(1) : 0;
                  
                  return (
                    <tr key={index}>
                      <td className="product-cell">{zipData.zip}</td>
                      <td className="rate-cell">{zipData.prospectCustomers.toLocaleString()}</td>
                      <td className="rate-cell">{zipData.existingCustomers.toLocaleString()}</td>
                      <td className="credit-cell">{total.toLocaleString()}</td>
                      <td className="discount-cell">{prospectPercent}%</td>
                      <td className="term-cell">{existingPercent}%</td>
                    </tr>
                  );
                })}
                {/* Totals Row */}
                <tr style={{ borderTop: '2px solid rgba(102, 126, 234, 0.3)', fontWeight: 'bold' }}>
                  <td className="product-cell" style={{ color: '#667eea' }}>TOTAL</td>
                  <td className="rate-cell" style={{ color: '#667eea' }}>{totalProspectCustomers.toLocaleString()}</td>
                  <td className="rate-cell" style={{ color: '#667eea' }}>{totalExistingCustomers.toLocaleString()}</td>
                  <td className="credit-cell" style={{ color: '#667eea' }}>{cohort.estimatedPeople.toLocaleString()}</td>
                  <td className="discount-cell" style={{ color: '#667eea' }}>
                    {((totalProspectCustomers / cohort.estimatedPeople) * 100).toFixed(1)}%
                  </td>
                  <td className="term-cell" style={{ color: '#667eea' }}>
                    {((totalExistingCustomers / cohort.estimatedPeople) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Active Promotions Section */}
          {activePromotions.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '12px', border: '1px solid rgba(102, 126, 234, 0.15)' }}>
              <h5 style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Active Promotions Targeting This Cohort:
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activePromotions.map((promo, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '500' }}>{promo.name}</span>
                    <span style={{ color: '#48bb78', fontSize: '0.85rem', fontWeight: '600' }}>{promo.discount}% off</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="agent-actions">
            <h5>A-OK Agent Actions:</h5>
            <div className="action-buttons">
              <button 
                className="agent-action-btn primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(cohort, 'create-promotion');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Create promotion for cohort
              </button>
              
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(cohort, 'analytics');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                View detailed analytics
              </button>
              
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(cohort, 'modify');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Modify cohort criteria
              </button>
              
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(cohort, 'export');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export cohort data
              </button>
              
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(cohort, 'campaign');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Send campaign/notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CohortCard.displayName = 'CohortCard';

export default CohortCard;

