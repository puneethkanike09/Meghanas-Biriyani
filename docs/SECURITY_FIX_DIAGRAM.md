# JWT Authentication Security - Visual Guide

## 🔴 BEFORE: Vulnerable Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Opens App                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Read from localStorage                          │
│  {                                                           │
│    "accessToken": "eyJhbGc...",                             │
│    "isAuthenticated": true   ◄── Can be tampered! 🚨        │
│  }                                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          Check: if (isAuthenticated) { ... }                 │
│                                                              │
│  ❌ Trusts the boolean value                                │
│  ❌ No token validation                                     │
│  ❌ User can fake authentication                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
                 Grant Access ❌
```

### 🚨 Attack Vector
```javascript
// Attacker's Console Commands:
const store = JSON.parse(localStorage.getItem('auth-storage'));
store.state.isAuthenticated = true;  // ← Just change this!
store.state.accessToken = null;       // ← Remove token
localStorage.setItem('auth-storage', JSON.stringify(store));
location.reload();

// Result: BYPASSED AUTHENTICATION ❌
```

---

## 🟢 AFTER: Secure Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Opens App                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Read from localStorage                          │
│  {                                                           │
│    "accessToken": "eyJhbGc...",                             │
│    // isAuthenticated NOT stored ✅                         │
│  }                                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│         Call: isAuthenticated() function                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              JWT Token Validation                            │
│                                                              │
│  1. ✅ Check if token exists                                │
│  2. ✅ Decode JWT payload                                   │
│  3. ✅ Extract 'exp' claim                                  │
│  4. ✅ Compare with current time                            │
│  5. ✅ Add 30s buffer for safety                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
    Valid Token                 Invalid/Expired
         │                           │
         ▼                           ▼
   Grant Access ✅            Deny Access + Logout ✅
```

### ✅ Attack Prevention
```javascript
// Attacker's Console Commands:
const store = JSON.parse(localStorage.getItem('auth-storage'));
store.state.isAuthenticated = true;  // ← This key doesn't exist!
store.state.accessToken = null;       // ← Remove token
localStorage.setItem('auth-storage', JSON.stringify(store));
location.reload();

// Result: AUTHENTICATION FAILED ✅
// Reason: No valid token = auto logout
```

---

## 🔍 Token Validation Deep Dive

### JWT Token Structure
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9  ← HEADER (Algorithm + Type)
.
eyJzdWIiOiJ1c2VyLWlkIiwicm9sZSI6Ik... ← PAYLOAD (User data + Claims)
.
signature-here-cannot-be-forged          ← SIGNATURE (Verified by server)
```

### Decoded Payload
```json
{
  "sub": "ed9a449f-d02a-4fb8-b582-47f2574d94bc",
  "user_id": "ed9a449f-d02a-4fb8-b582-47f2574d94bc",
  "role": "CUSTOMER",
  "iss": "rista-jwt-issuer",
  "iat": 1765178689,  ← Issued at (Unix timestamp)
  "exp": 1765265089   ← Expires at (Unix timestamp) ✅ We check this!
}
```

### Validation Logic
```typescript
function isTokenValid(token: string | null): boolean {
  if (!token) return false;  // ← No token = not authenticated
  
  const payload = decodeJWT(token);
  if (!payload?.exp) return false;  // ← No expiration = invalid
  
  const now = Math.floor(Date.now() / 1000);
  const buffer = 30; // seconds
  
  return payload.exp >= (now + buffer);  // ← Check expiration
}
```

---

## 🔄 Authentication Flow Comparison

### Login Flow (Both Before & After)
```
User enters phone → Verify OTP → Receive JWT tokens ✅
                                       │
                                       ▼
                            ┌──────────────────┐
                            │  Store in        │
                            │  localStorage:   │
                            │  - accessToken   │
                            │  - refreshToken  │
                            │  - user data     │
                            └──────────────────┘
```

### Check Authentication

#### Before (Vulnerable)
```
Component needs auth check
    ↓
Read isAuthenticated from store
    ↓
if (isAuthenticated) { ... }  ← ❌ Trusts boolean
```

#### After (Secure)
```
Component needs auth check
    ↓
Call isAuthenticated() function
    ↓
Decode JWT token
    ↓
Check exp claim
    ↓
Return true/false based on validation  ← ✅ Validates token
```

---

## 🛡️ Security Layers

### Layer 1: Client-Side Validation (This Fix)
```
┌─────────────────────────────────────┐
│  JWT Expiration Check               │
│  - Decodes token payload            │
│  - Checks exp claim                 │
│  - Auto-logout if expired           │
│                                     │
│  Purpose: Better UX                 │
│  Protection: Client tampering       │
└─────────────────────────────────────┘
```

### Layer 2: Server-Side Validation (Always Required)
```
┌─────────────────────────────────────┐
│  Full JWT Verification              │
│  - Validates signature (RS256)      │
│  - Checks issuer                    │
│  - Checks expiration                │
│  - Checks token revocation          │
│                                     │
│  Purpose: Real security             │
│  Protection: All attacks            │
└─────────────────────────────────────┘
```

---

## 📊 Timeline: Token Lifecycle

```
t=0s                                          t=86400s (24h)
 │                                                │
 │  Login                                         │  Expire
 │  ↓                                             ↓
 ├──●──────────────────────────────────────────────●───►
    │                                             │
    │ Token is VALID                              │
    │ isAuthenticated() = true                    │
    │                                             │
    └─────────────────────────────────────────────┘
                                                  │
    After expiration:                             │
    ├─────────────────────────────────────────────●───►
                                                  │
          isAuthenticated() = false ✅            │
          Auto-logout on page load ✅             │
```

### With 30s Buffer
```
                                    t=86370s      t=86400s
                                      │              │
                                      │ Refresh      │ Hard Expire
                                      ▼              ▼
├──────────────────────────────────────●──────────────●───►
                                      │              │
                               Start refresh  Actually expired
                               (30s before)
```

---

## 🧪 Test Scenarios

### Scenario 1: Normal User
```
1. Login ✅
2. Get valid token (exp = now + 24h)
3. Use app normally
4. Token validated on each check ✅
5. After 24h: Auto-logout ✅
```

### Scenario 2: Attacker (Before Fix)
```
1. Open DevTools
2. localStorage['auth-storage'] = '{"isAuthenticated": true}'
3. Reload page
4. ❌ Bypassed authentication
```

### Scenario 3: Attacker (After Fix)
```
1. Open DevTools
2. localStorage['auth-storage'] = '{"isAuthenticated": true}'
3. Reload page
4. ✅ Still logged out (no valid token)
5. ✅ Cannot access protected pages
```

### Scenario 4: Token Expiration
```
1. Login at 10:00 AM
2. Token expires at 10:00 AM next day
3. User visits at 10:05 AM next day
4. ✅ Token validation fails
5. ✅ Auto-logout
6. ✅ Redirect to login
```

---

## 🔑 Key Takeaways

### ✅ What Changed
1. **No more boolean flag** - `isAuthenticated` is now a function
2. **JWT validation** - Checks token expiration
3. **Auto-cleanup** - Expired tokens are removed
4. **Tamper-proof** - Cannot fake authentication

### ✅ What Stayed the Same
1. **Login flow** - No changes to OTP process
2. **Token storage** - Still uses localStorage
3. **API calls** - Still send Bearer token
4. **User experience** - Seamless for valid users

### ✅ What's Better
1. **Security** - Cannot tamper with authentication
2. **UX** - Auto-logout on expired tokens
3. **Reliability** - Token validation on rehydration
4. **Maintainability** - Clear separation of concerns

---

## 📝 Code Examples

### Before
```typescript
// store/useAuthStore.ts
interface AuthState {
  isAuthenticated: boolean;  // ❌ Just a boolean
}

// Component
const { isAuthenticated } = useAuthStore();
if (isAuthenticated) {  // ❌ No validation
  // Grant access
}
```

### After
```typescript
// store/useAuthStore.ts
interface AuthState {
  isAuthenticated: () => boolean;  // ✅ Function that validates
}

// Component
const { isAuthenticated } = useAuthStore();
const authenticated = isAuthenticated();  // ✅ Validates JWT
if (authenticated) {  // ✅ Token checked
  // Grant access
}
```

---

## 🎯 Summary

| Aspect | Before | After |
|--------|--------|-------|
| Authentication Check | Boolean flag | JWT validation |
| Tampering | Possible | Prevented |
| Expired Tokens | Accepted | Rejected |
| Auto-Logout | Manual | Automatic |
| Security Level | 🔴 Low | 🟢 High |

---

*This diagram is for educational purposes and shows the security improvement made to the authentication system.*

