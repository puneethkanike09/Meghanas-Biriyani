# JWT Authentication - Quick Reference

## 🚀 Usage

### In Components
```typescript
import { useAuthStore } from '@/store/useAuthStore';

function MyComponent() {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  
  // ✅ CORRECT: Call as function
  const authenticated = isAuthenticated();
  
  // ❌ WRONG: Don't use directly as boolean
  // if (isAuthenticated) { ... }
  
  if (authenticated) {
    return <div>Welcome {user?.name}!</div>;
  }
  
  return <div>Please login</div>;
}
```

### In useEffect
```typescript
useEffect(() => {
  const authenticated = isAuthenticated();
  if (authenticated) {
    // Load user data
  } else {
    router.push('/signin');
  }
}, [isAuthenticated, router]);
```

### Outside Components
```typescript
import { useAuthStore } from '@/store/useAuthStore';

// Get store instance
const store = useAuthStore.getState();

// Check authentication
const authenticated = store.isAuthenticated();

// Get token
const token = store.accessToken;
```

---

## 🔑 Auth Store API

### State
```typescript
user: User | null                 // Current user data
accessToken: string | null        // JWT access token
refreshToken: string | null       // JWT refresh token
```

### Methods
```typescript
isAuthenticated(): boolean        // Check if token is valid
setAuth(data)                    // Set auth data after login
logout()                         // Clear all auth data
updateAccessToken(token)         // Update access token only
```

---

## 🛠️ JWT Utilities

### Import
```typescript
import { 
  decodeJWT, 
  isTokenValid, 
  isTokenExpired, 
  getTokenExpiration 
} from '@/lib/jwt-utils';
```

### Functions

#### `decodeJWT(token: string): JWTPayload | null`
Decodes JWT token without verification.

```typescript
const payload = decodeJWT(token);
console.log(payload?.user_id);  // "ed9a449f-d02a-4fb8-b582-47f2574d94bc"
console.log(payload?.role);     // "CUSTOMER"
console.log(payload?.exp);      // 1765265089
```

#### `isTokenValid(token: string | null): boolean`
Checks if token exists and is not expired.

```typescript
if (isTokenValid(token)) {
  // Token is good to use
}
```

#### `isTokenExpired(token: string | null): boolean`
Checks if token is expired (with 30s buffer).

```typescript
if (isTokenExpired(token)) {
  // Refresh or logout
}
```

#### `getTokenExpiration(token: string | null): Date | null`
Returns token expiration as Date object.

```typescript
const exp = getTokenExpiration(token);
console.log(`Expires at: ${exp?.toLocaleString()}`);
```

---

## 🔐 Common Patterns

### Protected Route
```typescript
'use client';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  
  useEffect(() => {
    if (_hasHydrated && !isAuthenticated()) {
      router.push('/signin');
    }
  }, [isAuthenticated, _hasHydrated, router]);
  
  if (!_hasHydrated) {
    return <Loader />;
  }
  
  if (!isAuthenticated()) {
    return null; // or <Loader />
  }
  
  return <div>Protected content</div>;
}
```

### Conditional Rendering
```typescript
function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const authenticated = isAuthenticated();
  
  return (
    <header>
      {authenticated ? (
        <div>Welcome, {user?.name}</div>
      ) : (
        <Link href="/signin">Login</Link>
      )}
    </header>
  );
}
```

### API Call with Token
```typescript
import apiClient from '@/lib/api-client';

// Token is automatically added by interceptor
const response = await apiClient.get('/orders');

// Manual usage
const { accessToken } = useAuthStore.getState();
if (accessToken) {
  fetch('/api/endpoint', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}
```

---

## 🐛 Debugging

### Check Current Auth State
```typescript
// In browser console
const store = localStorage.getItem('auth-storage');
const parsed = JSON.parse(store);
console.log('Access Token:', parsed.state.accessToken);
console.log('User:', parsed.state.user);

// Decode token
const parts = parsed.state.accessToken.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Payload:', payload);
console.log('Expires:', new Date(payload.exp * 1000));
console.log('Expired?', payload.exp < Date.now() / 1000);
```

### Force Logout
```typescript
// In browser console
localStorage.removeItem('auth-storage');
window.location.reload();
```

### Test Token Validation
```typescript
// In React component
import { isTokenValid, decodeJWT } from '@/lib/jwt-utils';

const { accessToken } = useAuthStore();
console.log('Valid?', isTokenValid(accessToken));
console.log('Payload:', decodeJWT(accessToken));
```

---

## ⚠️ Common Mistakes

### ❌ Using isAuthenticated Directly
```typescript
// ❌ WRONG
const { isAuthenticated } = useAuthStore();
if (isAuthenticated) { ... }
```

### ✅ Call as Function
```typescript
// ✅ CORRECT
const { isAuthenticated } = useAuthStore();
const authenticated = isAuthenticated();
if (authenticated) { ... }
```

---

### ❌ Not Checking Hydration
```typescript
// ❌ WRONG - May cause flash of wrong content
function MyComponent() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <Profile /> : <Login />;
}
```

### ✅ Check Hydration First
```typescript
// ✅ CORRECT
function MyComponent() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  
  if (!_hasHydrated) {
    return <Loader />;
  }
  
  return isAuthenticated() ? <Profile /> : <Login />;
}
```

---

### ❌ Storing isAuthenticated
```typescript
// ❌ WRONG
const [authenticated, setAuthenticated] = useState(isAuthenticated());

// This won't update when token expires!
```

### ✅ Call Fresh Each Time
```typescript
// ✅ CORRECT
const { isAuthenticated } = useAuthStore();

// Call when needed
useEffect(() => {
  if (isAuthenticated()) {
    // Do something
  }
}, [isAuthenticated]);
```

---

## 📚 Token Claims Reference

### Standard Claims (from your tokens)
```typescript
{
  sub: string;      // Subject (user ID)
  user_id: string;  // User ID (duplicate)
  role: string;     // User role (CUSTOMER, ADMIN, etc.)
  iss: string;      // Issuer (rista-jwt-issuer)
  iat: number;      // Issued at (Unix timestamp in seconds)
  exp: number;      // Expires at (Unix timestamp in seconds)
}
```

### Example Values
```json
{
  "sub": "ed9a449f-d02a-4fb8-b582-47f2574d94bc",
  "user_id": "ed9a449f-d02a-4fb8-b582-47f2574d94bc",
  "role": "CUSTOMER",
  "iss": "rista-jwt-issuer",
  "iat": 1765178689,
  "exp": 1765265089
}
```

---

## 🔄 Token Refresh Flow

```typescript
// Automatic token refresh in api-client.ts
// When API returns 401:
// 1. Try to refresh using refreshToken
// 2. If success: Update accessToken and retry request
// 3. If fail: Logout user

// Manual refresh
import { AuthService } from '@/services/auth.service';

try {
  const { refreshToken } = useAuthStore.getState();
  const response = await AuthService.refreshToken(refreshToken);
  useAuthStore.getState().updateAccessToken(response.access_token);
} catch (error) {
  useAuthStore.getState().logout();
}
```

---

## 🎯 Quick Checklist

### Before Deploying
- [ ] Test normal login flow
- [ ] Test with expired token
- [ ] Test with invalid token
- [ ] Test auto-logout on page refresh
- [ ] Test protected routes
- [ ] Test API calls with token
- [ ] Verify token refresh works
- [ ] Check all `isAuthenticated` usage is updated

### After Deploying
- [ ] Monitor authentication errors
- [ ] Check for unexpected logouts
- [ ] Verify token refresh is working
- [ ] Monitor API 401 responses
- [ ] Check localStorage structure

---

## 📞 Help

- **Security docs**: `docs/JWT_AUTHENTICATION_SECURITY.md`
- **Testing guide**: `docs/TESTING_JWT_SECURITY.md`
- **Visual guide**: `docs/SECURITY_FIX_DIAGRAM.md`
- **Main summary**: `SECURITY_FIX_SUMMARY.md`

---

*Last Updated: December 8, 2025*





