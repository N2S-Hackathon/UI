# Dashboard Not Loading After Login - Troubleshooting Guide

## Issue
Login screen shows but Dashboard doesn't load after login.

## Quick Checks

### 1. Open Browser Console (F12)
Look for the following console messages:

**Expected Console Output:**
```
🟢 Dashboard component rendering...
🔵 Initializing conversation hook...
🔵 Conversation hook initialized: idle
🟢 Dashboard rendering JSX, isLoading: true, error: null, promotions: 0
```

**If you DON'T see these messages:**
- Dashboard component is not rendering at all
- Check for JavaScript errors in console (red text)
- Check for routing issues

**If you see red errors:**
- Note the error message
- Common errors and solutions below

### 2. Check Network Tab (F12 → Network)
After login, you should see API requests:
- `/api/product` - Should return 200 OK
- `/api/cohort-list` - Should return 200 OK  
- `/api/promotion` - Should return 200 OK

**If API requests fail:**
- Check if ngrok URL is still active: `https://barbie-euplastic-gibbously.ngrok-free.dev`
- Test API directly: Open URL in browser
- If ngrok expired, update `vite.config.js` with new URL

### 3. Check for White Screen
If screen is completely white/blank:
- **Cause:** JavaScript error preventing render
- **Solution:** Check console for error message

## Common Issues & Solutions

### Issue 1: "Cannot read property 'status' of undefined"
**Cause:** conversation hook returned undefined
**Solution:** Check that `useConversation` hook is exported correctly

### Issue 2: "getActiveConversation is not a function"
**Cause:** API function import issue
**Solution:** Verify `src/services/api.js` exports the function

### Issue 3: "Failed to fetch" or CORS errors
**Cause:** API proxy not working or ngrok URL expired
**Solution:**
1. Check vite dev server is running on correct port
2. Verify proxy configuration in `vite.config.js`
3. Test ngrok URL is accessible

### Issue 4: Dashboard shows but data doesn't load
**Cause:** API calls failing silently
**Solution:** Check console logs for:
```
📦 Fetching your product catalog...
👥 Loading customer cohorts...
📊 Retrieving promotional campaigns...
```

### Issue 5: Infinite loading spinner
**Cause:** API not responding or stuck in loading state
**Solution:**
1. Check if API responses are coming back (Network tab)
2. Look for error in console
3. Verify `isLoading` state is being set to false

## Diagnostic Console Commands

Open browser console (F12) and run:

### Check if Dashboard is mounted:
```javascript
document.querySelector('.dashboard-container')
```
Should return an HTMLDivElement. If null, Dashboard didn't render.

### Check conversation hook state:
Look for console logs:
```
🔵 Conversation hook initialized: idle
```

### Check data loading:
Look for console logs:
```
✓ Found X products available
✓ Loaded X customer segments
✓ Loaded X promotions
```

## Manual Tests

### Test 1: Login Flow
1. Go to http://localhost:3006/
2. Should redirect to /login
3. Enter any email/password
4. Click Sign in
5. Should navigate to /dashboard
6. Dashboard should start loading data

### Test 2: API Connection
Open new browser tab and test:
```
https://barbie-euplastic-gibbously.ngrok-free.dev/product
```
Should prompt for basic auth or show JSON data.

### Test 3: Proxy Working
From browser console on http://localhost:3006:
```javascript
fetch('/api/product')
  .then(r => r.json())
  .then(d => console.log('Products:', d))
  .catch(e => console.error('Error:', e))
```
Should log products array.

## Recent Changes That Could Cause Issues

### Auto-Reload Effect (Added)
Location: `src/pages/Dashboard.jsx` lines 59-93

**Potential Issue:** Effect runs before products are loaded
**Fix Applied:** Added `products.length > 0` guard

### Conversation Hook Integration
Location: `src/pages/Dashboard.jsx` line 38

**Potential Issue:** Hook initialization fails
**Check:** Console should show "🔵 Conversation hook initialized: idle"

## Step-by-Step Debugging

1. **Refresh page with Console open (F12)**
   - Watch for console messages
   - Note any red errors

2. **Check what renders**
   - If Login shows: routing works ✓
   - If Dashboard header shows: component mounted ✓
   - If data loading: API calls working ✓

3. **Check Network tab**
   - Filter by "api"
   - Look for /product, /cohort-list, /promotion calls
   - Check status codes (should be 200)

4. **Check Console logs**
   - Look for 🟢 Dashboard rendering messages
   - Look for API success messages (✓ Found X products)
   - Look for errors (⚠️ or red text)

## Quick Fix: Temporary Bypass

If you need to test without API, temporarily add this at top of Dashboard.jsx:

```javascript
// TEMPORARY: Skip API calls for testing
useEffect(() => {
  setIsLoading(false);
  setPromotions([]);
  setProducts([]);
  setCohorts([]);
}, []);
```

This will load empty dashboard without API calls.

## What to Report

If issue persists, please provide:

1. **Console logs** (copy all messages)
2. **Network tab** (screenshot of API calls)
3. **Error messages** (full error text)
4. **URL** shown in browser address bar
5. **Which step fails** (login? navigation? data loading?)

## Files Modified That Could Cause Issue

- ✅ `src/pages/Dashboard.jsx` - Main component
- ✅ `src/hooks/useConversation.js` - Conversation management
- ✅ `src/components/ChatSidebar.jsx` - Chat UI
- ✅ `src/services/api.js` - API calls
- ✅ `vite.config.js` - Proxy configuration

## Emergency Rollback

If dashboard is completely broken, you can rollback recent changes:

```powershell
git status
git diff src/pages/Dashboard.jsx
git checkout src/pages/Dashboard.jsx  # WARNING: Loses changes
```

---

**Next Steps:**
1. Open http://localhost:3006/ in browser
2. Open Developer Console (F12)
3. Try to login
4. Report what you see in console

