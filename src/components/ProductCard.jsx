import { memo } from 'react';

const ProductCard = memo(({ product }) => {
  return (
    <div className="product-row">
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
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

