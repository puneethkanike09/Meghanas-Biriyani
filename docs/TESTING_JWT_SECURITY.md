# Testing JWT Authentication Security

## Quick Test Guide

### Test 1: Verify Token Tampering is Prevented

**Before the fix** (vulnerable):
1. Open DevTools → Application → Local Storage
2. Find `auth-storage` key with this structure:
   ```json
   {
     "state": {
       "user": null,
       "accessToken": null,
       "refreshToken": null,
       "isAuthenticated": true  // ❌ Manually set to true
     }
   }
   ```
3. The app would think you're authenticated and let you access protected pages

**After the fix** (secure):
1. Even if you manually set any boolean flag, it's ignored
2. Authentication is validated by decoding the JWT token
3. If token is missing or expired, you're redirected to login

### Test 2: Verify Expired Tokens are Handled

1. **Login normally** to get a valid token
2. **Decode the token** using [jwt.io](https://jwt.io) to see the `exp` claim
3. **Wait or manually set** your system clock to after the expiration time
4. **Refresh the page**
5. **Expected Result**: You're automatically logged out

### Test 3: Verify Invalid Token Detection

1. **Login normally**
2. **Open DevTools** → Application → Local Storage → `auth-storage`
3. **Edit the `accessToken`** to an invalid string like `"invalid.token.here"`
4. **Refresh the page**
5. **Expected Result**: You're logged out and redirected to signin

### Test 4: Verify Real Authentication Still Works

1. **Clear localStorage** completely
2. **Login normally** with your phone number
3. **Enter the OTP** you receive
4. **Expected Result**: 
   - You're logged in successfully
   - Token is stored in localStorage
   - You can access protected pages
   - API calls include the Bearer token

## Understanding Your JWT Token

### Decode Your Token
Visit [jwt.io](https://jwt.io) and paste your `accessToken` to see its contents:

```json
{
  "sub": "ed9a449f-d02a-4fb8-b582-47f2574d94bc",
  "user_id": "ed9a449f-d02a-4fb8-b582-47f2574d94bc",
  "role": "CUSTOMER",
  "iss": "rista-jwt-issuer",
  "iat": 1765178689,  // Issued at: Dec 8, 2025
  "exp": 1765265089   // Expires: Dec 9, 2025 (24 hours later)
}
```

### Key Fields Explained

- **`sub`** (Subject): User ID
- **`user_id`**: Duplicate of user ID for convenience
- **`role`**: User's role (CUSTOMER, ADMIN, etc.)
- **`iss`** (Issuer): Who issued the token
- **`iat`** (Issued At): When the token was created (Unix timestamp in seconds)
- **`exp`** (Expires): When the token expires (Unix timestamp in seconds)

### Token Lifetime

```
Current time:     1765178689 (Dec 8, 2025 10:24:49 AM)
Token expires:    1765265089 (Dec 9, 2025 10:24:49 AM)
Lifetime:         86,400 seconds = 24 hours
```

## Developer Testing Console Commands

### Check if Currently Authenticated
```javascript
// Open browser console
const store = localStorage.getItem('auth-storage');
const parsed = JSON.parse(store);
console.log('Access Token:', parsed.state.accessToken);

// Decode the token manually
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
  return JSON.parse(jsonPayload);
}

const payload = parseJwt(parsed.state.accessToken);
console.log('Token payload:', payload);
console.log('Expires:', new Date(payload.exp * 1000));
console.log('Expired?', payload.exp < Date.now() / 1000);
```

### Manually Trigger Token Validation
```javascript
// Import the utility (in React component)
import { isTokenValid, getTokenExpiration } from '@/lib/jwt-utils';

const token = useAuthStore.getState().accessToken;
console.log('Is valid?', isTokenValid(token));
console.log('Expires at:', getTokenExpiration(token));
```

### Force Logout
```javascript
// Open browser console
localStorage.removeItem('auth-storage');
window.location.reload();
```

## Common Issues and Solutions

### Issue: "Token expired but I'm still logged in"
**Cause**: Token validation happens on:
- Page refresh/reload
- When calling `isAuthenticated()`
- Not on every render (for performance)

**Solution**: Refresh the page to trigger rehydration validation

### Issue: "API calls fail with 401"
**Cause**: 
1. Token is expired (server validated and rejected)
2. Token signature is invalid
3. Token is revoked

**Solution**: 
- The app should automatically try to refresh using the refresh token
- If refresh fails, you're logged out automatically
- Check console for error messages

### Issue: "I can see the token in localStorage but still logged out"
**Cause**: Token is expired or invalid

**Solution**: This is correct behavior! Check the token's `exp` claim.

## Security Best Practices

### ✅ DO:
- Store tokens in localStorage (acceptable for this use case)
- Use HTTPS in production
- Implement short token expiration times
- Use refresh tokens for extended sessions
- Validate tokens on the server

### ❌ DON'T:
- Store sensitive data in JWT payload (it's base64, not encrypted)
- Share your tokens with anyone
- Use the same token across different devices (use refresh tokens)
- Rely only on client-side validation (server must validate too)
- Store private keys in the frontend

## Monitoring Token Health

### Check Token Status in Components
```typescript
import { useAuthStore } from '@/store/useAuthStore';
import { decodeJWT, getTokenExpiration } from '@/lib/jwt-utils';

function TokenDebugger() {
  const { accessToken, isAuthenticated } = useAuthStore();
  
  const authenticated = isAuthenticated();
  const expiration = getTokenExpiration(accessToken);
  const payload = accessToken ? decodeJWT(accessToken) : null;
  
  return (
    <div>
      <p>Authenticated: {authenticated ? 'Yes' : 'No'}</p>
      <p>Expires: {expiration?.toLocaleString()}</p>
      <p>User ID: {payload?.user_id}</p>
      <p>Role: {payload?.role}</p>
    </div>
  );
}
```

## Next Steps

After confirming the security fix works:
1. ✅ Clear all localStorage for existing users (they'll need to re-login)
2. ✅ Monitor for authentication issues in production
3. ✅ Consider implementing refresh token rotation for additional security
4. ✅ Add logging for failed authentication attempts
5. ✅ Implement rate limiting on login endpoints








