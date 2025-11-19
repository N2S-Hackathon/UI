# Product Name Debugging Guide

## Issue
Product names showing "Product info loading..." instead of actual product names in promotion cards.

## Debugging Steps Added

### 1. Check Products Loading
Open the browser console and look for:
```
Loaded products: [{ id: 1, name: "..." }, { id: 2, name: "..." }]
```

**What to verify:**
- Are products loading successfully?
- Do products have `id` and `name` fields?
- What are the product IDs?

### 2. Check Promotion Enrichment
Look for these logs for each promotion:
```
Enriching promotion: {
  promoId: "uuid...",
  promoName: "...",
  productId: 5,
  foundProduct: { id: 5, name: "..." },
  productName: "..."
}
```

**OR**

```
No productId for promotion: "..."
```

**What to verify:**
- Does the promotion have a `productId`?
- Is a matching product found?
- What is the `productName` value?

### 3. Check Rendering
When you expand a promotion, look for:
```
PromotionCard rendering: {
  promotionName: "...",
  productsArray: ["Product Name"] or [],
  productsLength: 1 or 0,
  productId: 5,
  firstProduct: "Product Name" or "Product info loading..."
}
```

**What to verify:**
- Is `productsArray` empty `[]` or does it have items?
- What is `firstProduct` showing?

## Common Issues & Solutions

### Issue 1: Product IDs Don't Match
**Symptom:** `foundProduct: undefined` in enrichment logs

**Cause:** The `productId` from promotion doesn't match any product `id`

**Possible Reasons:**
1. **Type Mismatch** (MOST COMMON): API returns productid as number for products but string for promotions (or vice versa)
   - **FIXED**: Code now converts both to numbers before comparing
2. **Wrong ID**: The productid values simply don't match
   
**Solution:** Check the enrichment logs for:
- `productIdType`: Shows if it's "number" or "string"
- `availableProductIds`: Shows all product IDs and their types
- Compare to see if the productId exists in the list

### Issue 2: Products Array Empty After Enrichment
**Symptom:** `productsArray: []` in render logs

**Possible causes:**
1. No `productId` in promotion data
2. Product not found during lookup
3. Enrichment not running

**Debug:** Check enrichment logs to see if enrichment ran for that promotion

### Issue 3: Products Not Loading
**Symptom:** No "Loaded products" log, or empty array

**Cause:** API call failing or returning empty data

**Solution:** Check network tab for `/product` API call

## Quick Test

Add this to browser console after page loads:
```javascript
// Check what's in React state
// (This won't work directly, but you can check the logs)

// Look for these patterns in console:
// 1. "Loaded products: ..." - should show array of products
// 2. "Enriching promotion: ..." - should show matching happening  
// 3. "PromotionCard rendering: ..." - should show final data
```

## Expected Data Flow

1. **Load Products** → Array of products with `id` and `name`
2. **Load Promotions** → Array of promotions with `productId` 
3. **Enrich** → Match `productId` to product `id`, create `products: [name]` array
4. **Render** → Use `products` array in UI

## Next Steps Based on Console Output

### If products array is empty in logs:
Check the enrichment step - is `foundProduct` undefined?

### If foundProduct is undefined:
The productId doesn't match. Verify:
- Product IDs from API
- Promotion productIds from API
- Are they the same type (number vs string)?

### If products array has items but UI shows fallback:
There may be a React state update issue. Check if `setPromotions()` is being called with enriched data.


