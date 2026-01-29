
# Mobile Performance Optimization Plan

## Current State Analysis

Based on my exploration, the following optimizations have already been implemented:
- Logo image optimized to 80x80 WebP format (`logo-small.webp`)
- Non-blocking font loading using the `media="print"` trick
- Preload hint for the logo in `index.html`
- Deferred Three.js loading using `requestIdleCallback` 
- All routes are lazy-loaded in `App.tsx`
- Tailwind CSS purging is properly configured

However, these optimizations have **not yet been published**, which is why the audit still shows the old metrics. Additionally, there are several remaining issues that need addressing.

---

## Issue-by-Issue Action Plan

### 1. Avoid Multiple Page Redirects (Est. savings: 780ms)
**Root Cause:** Traffic is being redirected from `utaab.lovable.app` to `utaab.org`, adding 780ms latency.

**Solution:** Set `utaab.org` as the primary domain in project settings.

**Action Required:**
- Navigate to Project Settings > Domains
- Set `utaab.org` as the primary domain
- This is a configuration change, not a code change

---

### 2. Document Request Latency (Est. savings: 60ms)
**Root Cause:** Related to the redirect issue above.

**Solution:** Resolves automatically when the primary domain redirect is fixed.

---

### 3. First Contentful Paint (Est. savings: 4.5s)
**Root Cause:** Render-blocking resources and large image assets.

**Already Implemented:**
- Non-blocking font loading
- Preload hint for logo

**Needs Publishing:** The current changes need to be published to take effect.

---

### 4. Improve Image Delivery (Est. savings: 370 KiB)
**Root Cause:** The audit is still seeing the old 1250x1250 PNG logo.

**Already Implemented:**
- Optimized logo (`logo-small.webp`) at 80x80 pixels
- Updated `Navbar.tsx` to use the new asset
- Preload hint added to `index.html`

**Needs Publishing:** Changes need to be deployed.

---

### 5. Largest Contentful Paint (Est. savings: 7.7s)
**Root Cause:** Combination of render-blocking fonts, large images, and JavaScript execution.

**Already Implemented:**
- Non-blocking fonts
- Optimized logo with preload

**Additional Optimization Needed:**
- Add `fetchpriority="high"` to the preloaded logo (already done in Navbar)
- Ensure the Hero section renders immediately without waiting for JS

---

### 6. Minimize Main-Thread Work (Est. savings: 3.6s)
**Root Cause:** Heavy Three.js initialization and Framer Motion animations on mobile.

**Already Implemented:**
- Three.js is deferred using `requestIdleCallback` with 2-second timeout
- Scene only loads after page is fully interactive

**Additional Optimization Needed:**
- Conditionally disable Three.js on mobile devices to save ~215KB of JavaScript
- Simplify or disable complex animations on mobile using `prefers-reduced-motion`

---

### 7. Network Dependency Tree
**Root Cause:** Critical request chains are long.

**Solution:**
- Inline critical CSS for above-the-fold content
- Continue using preconnect/dns-prefetch hints (already done)
- Ensure Three.js chunk is not in the critical path (already done)

---

### 8. Reduce Unused CSS (Est. savings: 13 KiB)
**Analysis:** This is a false positive for SPAs. The CSS bundle contains styles for all pages, but Lighthouse only audits the homepage.

**Decision:** No changes recommended - modifying this would break other pages.

---

### 9. Reduce Unused JavaScript (Est. savings: 208 KiB)
**Root Cause:** Three.js and Framer Motion bundles are large.

**Already Implemented:**
- All routes are lazy-loaded
- Three.js is deferred until after page is interactive

**Additional Optimization Needed:**
- Skip loading Three.js entirely on mobile devices (saves ~215KB)
- This provides the biggest performance win for mobile users

---

### 10. Render Blocking Requests (Est. savings: 1,350ms)
**Root Cause:** Font loading was blocking render.

**Already Implemented:**
- Non-blocking font loading with `media="print"` trick

**Needs Publishing:** Changes are in place but not deployed.

---

### 11. Speed Index (Est. savings: 6.0s)
**Already Implemented:**
- Optimized logo image
- Non-blocking fonts

**Needs Publishing:** Deploy current changes.

---

### 12. Time to Interactive (Est. savings: 7.8s)
**Already Implemented:**
- Three.js deferred with `requestIdleCallback`
- All routes lazy-loaded

**Additional Optimization Needed:**
- Disable Three.js on mobile to prevent main-thread blocking entirely

---

### 13. Use Efficient Cache Lifetimes (Est. savings: 952 KiB)
**Root Cause:** Server is not setting proper cache-control headers.

**Solution:** Add caching headers configuration to Vite build or server configuration.

**Note:** This requires server-side configuration that may be handled by the hosting platform (Lovable).

---

## Technical Implementation Details

### Change 1: Disable Three.js on Mobile Devices

Update `src/components/Hero.tsx` to skip loading the Three.js scene on mobile:

```text
// Add mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if this is a mobile device based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// In Hero component:
const isMobile = useIsMobile();
const shouldLoadScene = useDeferredLoad(500) && !isMobile;
```

This prevents the ~215KB Three.js bundle from loading on mobile devices, significantly improving TTI and reducing main-thread work.

### Change 2: Add Inline Critical CSS

Add a minimal inline style block in `index.html` to render the page skeleton immediately:

```text
<style>
  body{background:#0a0a0f;color:#fafafa;font-family:system-ui,sans-serif}
  #root{min-height:100vh}
  .loading-skeleton{display:flex;align-items:center;justify-content:center;min-height:100vh}
</style>
```

This ensures the page has a visible background immediately, improving perceived load time.

### Change 3: Update Vite Config for Better Code Splitting

Add manual chunks configuration to separate heavy dependencies:

```text
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-router': ['react-router-dom'],
        'vendor-motion': ['framer-motion'],
        'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
      }
    }
  }
}
```

This ensures Three.js is completely separate and only loaded when needed.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Add mobile detection to skip Three.js on mobile |
| `index.html` | Add inline critical CSS for immediate render |
| `vite.config.ts` | Add manual chunks for better code splitting |

## Configuration Changes Required

| Setting | Action |
|---------|--------|
| Primary Domain | Set `utaab.org` as primary to eliminate 780ms redirect |
| Publish | Deploy current optimizations (logo, fonts) to production |

## Expected Impact

After implementation and publishing:

| Metric | Current | Expected |
|--------|---------|----------|
| Page Redirects | 780ms | 0ms |
| Image Delivery | 370 KiB wasted | ~0 KiB wasted |
| JS Bundle (mobile) | +215 KiB Three.js | 0 KiB (skipped) |
| FCP | ~4.5s | ~1-2s |
| LCP | ~7.7s | ~2-3s |
| TTI | ~7.8s | ~2-3s |
| Speed Index | ~6s | ~2-3s |

---

## Recommended Order of Actions

1. Approve and implement the code changes (mobile Three.js skip, critical CSS, code splitting)
2. Publish the application to deploy all pending optimizations
3. Set `utaab.org` as the primary domain in project settings
4. Re-run the performance audit to verify improvements
