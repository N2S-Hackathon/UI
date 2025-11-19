import { memo } from 'react';

const PromotionCard = memo(({ 
  promotion, 
  isExpanded, 
  onToggle, 
  onOpenModal
}) => {
  return (
    <div className={`promotion-accordion ${isExpanded ? 'expanded' : ''}`}>
      {/* Collapsed State */}
      <div className="promotion-summary" onClick={onToggle}>
        <div className="promotion-summary-left">
          <div className="promotion-header-row">
            <h4 className="promotion-name">{promotion.name}</h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={`badge badge-${promotion.status}`}>
                {promotion.status}
              </span>
              {promotion.isStagingOnly ? (
                <span className="badge" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
                  ✨ New Promotion
                </span>
              ) : promotion.hasPendingChanges ? (
                <span className="badge" style={{ backgroundColor: '#ffc107', color: '#000' }}>
                  ⚠️ Pending Changes
                </span>
              ) : null}
            </div>
          </div>
          <div className="promotion-products">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <span>
              {promotion.products && promotion.products.length > 0 
                ? promotion.products.join(' • ') 
                : promotion.productId 
                  ? `Product ID: ${promotion.productId}` 
                  : 'No product specified'}
            </span>
          </div>
        </div>
        
        <div className="promotion-summary-right">
          <div className="promotion-cohort">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{promotion.cohort}</span>
          </div>
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
          <div className="expand-icon">
            <span className="expand-text">view rates</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded State */}
      {isExpanded && (
        <div className="promotion-details">
          {/* Rates Table */}
          <div className="rates-table-container">
            <table className="rates-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Final Rate</th>
                  <th>National Rate</th>
                  <th>Discount</th>
                  <th>Credit</th>
                  <th>Term</th>
                </tr>
              </thead>
              <tbody>
                {(promotion.products && promotion.products.length > 0 ? promotion.products : ['Product info loading...']).map((productName, index) => {
                  // Debug logging
                  if (index === 0) {
                    console.log('PromotionCard rendering:', {
                      promotionName: promotion.name,
                      productsArray: promotion.products,
                      productsLength: promotion.products?.length,
                      productId: promotion.productId,
                      firstProduct: productName
                    });
                  }
                  
                  // Mock data - will be replaced with API call later
                  const baseRate = 59.99 + (index * 20);
                  const finalRate = baseRate * (1 - promotion.discount / 100);
                  const discountAmount = baseRate - finalRate;
                  const discountMonths = 12;
                  const term = '24 months';
                  const nationalRate = baseRate + 10;
                  
                  // Only first and second products get credit (covers cost for 3 months)
                  const hasCredit = index === 0 || index === 1;
                  const creditMonths = 3;
                  const creditAmount = hasCredit ? finalRate * creditMonths : null;
                  
                  return (
                    <tr key={index}>
                      <td className="product-cell">{productName}</td>
                      <td className="rate-cell">
                        <div className="rate-main">${finalRate.toFixed(2)}/mo</div>
                        {hasCredit && (
                          <div className="rate-credit-note">($0 for {creditMonths} months)</div>
                        )}
                      </td>
                      <td className="rate-cell">${nationalRate.toFixed(2)}/mo</td>
                      <td className="discount-cell">${discountAmount.toFixed(2)} for {discountMonths} months</td>
                      <td className={hasCredit ? "credit-cell" : "credit-cell credit-na"}>
                        {hasCredit ? `$${creditAmount.toFixed(2)} over ${creditMonths} months` : 'N/A'}
                      </td>
                      <td className="term-cell">{term}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Staging Records Section */}
          {promotion.stagingRecords && promotion.stagingRecords.length > 0 && (
            <div className="staging-records" style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#fff9e6', 
              border: '1px solid #ffc107',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ margin: 0, color: '#856404' }}>
                  ⚠️ Pending Staging Changes ({promotion.stagingRecords.length})
                </h5>
              </div>
              {promotion.stagingRecords.map((staging, idx) => (
                <div key={staging.stagingId} style={{ 
                  padding: '10px', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  marginBottom: idx < promotion.stagingRecords.length - 1 ? '8px' : '0'
                }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Status:</strong> {staging.status} | <strong>Created:</strong> {new Date(staging.createdOn).toLocaleString()}
                  </div>
                  {staging.promotionName && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      <strong>Name:</strong> {staging.promotionName}
                    </div>
                  )}
                  {staging.action && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      <strong>Action:</strong> {staging.action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="agent-actions">
            <h5>A-OK Agent Actions:</h5>
            <div className="action-buttons">
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(promotion, 'dates');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Change dates
              </button>
              
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(promotion, 'products');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                Change products
              </button>
              
              <button 
                className="agent-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(promotion, 'credit');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Change credit
              </button>
              
              <button 
                className="agent-action-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(promotion, 'end');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                End promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PromotionCard.displayName = 'PromotionCard';

export default PromotionCard;

