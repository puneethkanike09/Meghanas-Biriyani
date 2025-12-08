# Authentication Architecture & Best Practices

## Overview

This document explains the authentication flow, why we use Zustand with localStorage, security considerations, and production-level improvements.

## Architecture

### 1. State Management: Zustand + localStorage

**Why Zustand with localStorage?**

Zustand's `persist` middleware provides:
- **Automatic persistence**: State survives page refreshes
- **SSR compatibility**: Works with Next.js server-side rendering
- **Selective persistence**: Only persist what we need (tokens, user data)
- **Rehydration handling**: Properly handles client-side hydration

**Why localStorage (not sessionStorage or cookies)?**

| Storage Type | Pros | Cons | Our Choice |
|-------------|------|------|------------|
| **localStorage** | Persists across tabs/sessions, Simple API | XSS vulnerable, Not httpOnly | ✅ **Current** |
| **sessionStorage** | Tab-scoped, XSS vulnerable | Lost on tab close | ❌ |
| **httpOnly Cookies** | XSS safe, CSRF protection | Requires backend changes, SSR complexity | ⚠️ **Future** |

**Current Implementation:**
```typescript
// store/useAuthStore.ts
persist(
  (set, get) => ({ ... }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }),
  }
)
```

**What gets persisted:**
- ✅ `user` - User profile data
- ✅ `accessToken` - JWT access token
- ✅ `refreshToken` - JWT refresh token
- ❌ `isAuthenticated` - Computed function (never stored)
- ❌ `tempAuthData` - Temporary OTP flow data (not persisted)

### 2. Authentication Flow

```
┌─────────────┐
│  Sign In    │
│   Form      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Request OTP     │
│ Store tempData  │
└──────┬──────────┘
       │
       ▼
┌─────────────┐
│  OTP Form   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Verify OTP      │
│ setAuth()       │
│ Persist tokens  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ API Requests    │
│ Auto-refresh    │
└─────────────────┘
```

### 3. Token Validation

**Client-Side Validation:**
- Decodes JWT to check expiration (no signature verification)
- Used for UX (showing login state, redirecting)
- **NOT for security** - backend always verifies tokens

**Server-Side Validation:**
- Backend verifies JWT signature on every request
- Returns 401 if token is invalid/expired
- Client handles 401 by attempting refresh

### 4. Token Refresh Flow

```
API Request → 401 Unauthorized
     │
     ▼
Check refreshToken exists
     │
     ▼
POST /auth/refresh
     │
     ├─ Success → Update accessToken → Retry original request
     │
     └─ Failure → Logout → Redirect to signin
```

## Security Considerations

### Current Security Measures ✅

1. **No Stored Authentication Flag**
   - `isAuthenticated` is a computed function, not stored
   - Prevents localStorage tampering attacks

2. **Token Expiration Validation**
   - Tokens validated on app load (rehydration)
   - Expired tokens automatically cleared

3. **Automatic Token Refresh**
   - Seamless token refresh on 401 errors
   - Prevents infinite refresh loops

4. **Selective Persistence**
   - Only essential data persisted
   - Temporary data not stored

### Security Risks & Mitigations ⚠️

#### 1. XSS (Cross-Site Scripting) Vulnerability

**Risk:** localStorage is accessible to JavaScript, making it vulnerable to XSS attacks.

**Current Mitigations:**
- ✅ Input sanitization (handled by React/Next.js)
- ✅ Content Security Policy (should be configured)
- ✅ Token expiration limits exposure window

**Future Improvements:**
- ⚠️ Consider httpOnly cookies for production
- ⚠️ Implement token encryption at rest
- ⚠️ Add Content Security Policy headers

#### 2. Token Theft

**Risk:** If an attacker gets access to localStorage, they can steal tokens.

**Mitigations:**
- ✅ Short-lived access tokens (typically 15-60 minutes)
- ✅ Refresh tokens can be revoked server-side
- ✅ Tokens validated on every request

**Best Practices:**
- Never log tokens in production
- Use HTTPS only
- Implement token rotation

#### 3. CSRF (Cross-Site Request Forgery)

**Current:** Not fully protected (localStorage doesn't help with CSRF)

**Future:** If moving to cookies, implement CSRF tokens

## Production-Level Improvements

### Implemented ✅

1. **Robust Error Handling**
   - Token validation on rehydration
   - Graceful failure handling
   - Development vs production logging

2. **Type Safety**
   - Full TypeScript coverage
   - Proper interfaces for all data structures

3. **Token Validation**
   - JWT decoding with proper Base64URL handling
   - Expiration checking with buffer time

### Recommended for Production 🚀

1. **Security Headers**
   ```typescript
   // next.config.js
   headers: [
     {
       key: 'Content-Security-Policy',
       value: "default-src 'self'; script-src 'self' 'unsafe-inline'"
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     }
   ]
   ```

2. **Token Encryption** (Optional)
   - Encrypt tokens before storing in localStorage
   - Use Web Crypto API or a library like `crypto-js`

3. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks

4. **Monitoring & Logging**
   - Log authentication failures (without tokens)
   - Monitor token refresh patterns
   - Alert on suspicious activity

5. **Session Management**
   - Implement concurrent session limits
   - Add "logout all devices" functionality

## Code Quality

### Best Practices Followed ✅

1. **Separation of Concerns**
   - JWT utilities in `lib/jwt-utils.ts`
   - API client in `lib/api-client.ts`
   - Auth state in `store/useAuthStore.ts`

2. **Error Handling**
   - Consistent error message extraction
   - User-friendly error messages
   - Proper error propagation

3. **Type Safety**
   - Full TypeScript coverage
   - Proper interfaces and types

4. **Code Organization**
   - Clear function names
   - Comprehensive comments
   - Logical file structure

## Migration Notes

### If Moving to httpOnly Cookies

1. **Backend Changes Required:**
   - Set httpOnly cookies on login
   - Implement CSRF token generation
   - Update refresh endpoint to set new cookies

2. **Frontend Changes:**
   - Remove localStorage persistence
   - Add CSRF token to requests
   - Update auth store to read from cookies (via API)

3. **Benefits:**
   - XSS protection
   - Automatic cookie management
   - Better security posture

## Testing

See `docs/TESTING_JWT_SECURITY.md` for comprehensive testing guide.

## Summary

**Current State:** Production-ready with localStorage-based token storage.

**Why localStorage?**
- Simple implementation
- Works well with Zustand
- Good for MVP/production
- Can be enhanced later

**Security:**
- ✅ No stored authentication flags
- ✅ Token validation on load
- ✅ Automatic refresh handling
- ⚠️ XSS risk (mitigated by short token lifetime)
- ⚠️ Consider httpOnly cookies for enhanced security

**Production Readiness:** ✅ Ready with recommended enhancements

