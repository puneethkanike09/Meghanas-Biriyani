# Firebase Cloud Messaging (FCM) Setup Guide

## 📱 Overview

This guide explains how Firebase Cloud Messaging (FCM) is set up in the Meghana's Biriyani Next.js application for push notifications.

## 🎯 Use Cases

1. **Order Notifications**: Users receive real-time updates when:
   - Order is created/confirmed
   - Order is being prepared
   - Order is out for delivery
   - Order is delivered
   - Order is cancelled

2. **Promotional Notifications**: 
   - Special offers and discounts
   - New menu items
   - Restaurant announcements

3. **Background & Foreground Support**:
   - **Foreground**: When user has the app open, notifications show as toast messages
   - **Background**: When app is in background/closed, notifications show as system notifications

## 🏗️ Architecture

### Files Created

```
├── lib/
│   ├── firebase.ts                    # Firebase initialization
│   ├── fcm-notifications.ts           # FCM utility functions
│   └── hooks/
│       └── useFCM.ts                  # React hook for FCM
├── components/
│   ├── FCMProvider.tsx                # FCM provider component
│   └── NotificationPermissionButton.tsx # UI component for permissions
├── public/
│   └── firebase-messaging-sw.js       # Service worker for background notifications
└── .env.local                          # Environment variables (gitignored)
```

### Component Hierarchy

```
app/layout.tsx (Root)
├── FCMProvider (Wraps entire app)
│   ├── useFCM hook (Manages FCM state)
│   │   ├── Service Worker Registration
│   │   ├── Permission Request
│   │   ├── Token Management
│   │   └── Message Listening
│   └── Children (Your app components)
```

## 🔧 Setup Instructions

### 1. Environment Variables

The `.env.local` file contains your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC4DbWsh4FL5OcKO63YB8yIMgRE3vL9jaw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=meghana-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=meghana-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=meghana-dev.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=299471620750
NEXT_PUBLIC_FIREBASE_APP_ID=1:299471620750:web:8f28c39ee974a09717d7df
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0Z2CF26D34
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BFegLnUdAe-rp5PwJsTwR6u_W0iwV6vyUoe6Tnd07y9jvZPsVTTtkFhafEC-CXBRfWAXmh2r-YN7UBcfA9G22Vw
```

⚠️ **Note**: These are public keys and safe to expose in client-side code.

### 2. Service Worker

The `firebase-messaging-sw.js` file in the `public` directory handles background notifications:

- **Location**: Must be in `/public` directory
- **Access**: Available at `https://yourapp.com/firebase-messaging-sw.js`
- **Purpose**: Handles notifications when app is closed/in background

### 3. Integration

FCM is automatically initialized in your app through the `FCMProvider` in `app/layout.tsx`:

```tsx
<FCMProvider>
  {children}
</FCMProvider>
```

## 🚀 Usage

### Automatic Usage (Default)

FCM is automatically active once the user grants notification permission. The system will:

1. Register the service worker
2. Request notification permission (after user logs in)
3. Get FCM token
4. Save token to backend (ready for your backend integration)
5. Listen for incoming messages

### Manual Permission Request

Use the `NotificationPermissionButton` component anywhere in your app:

```tsx
import { NotificationPermissionButton } from "@/components/NotificationPermissionButton";

function SettingsPage() {
  return (
    <div>
      <h2>Notification Settings</h2>
      <NotificationPermissionButton 
        text="Enable Push Notifications"
        variant="primary"
      />
    </div>
  );
}
```

### Using the useFCM Hook

For advanced usage in your components:

```tsx
"use client";

import { useFCM } from "@/lib/hooks/useFCM";

function MyComponent() {
  const { 
    token,           // FCM device token
    permission,      // "granted" | "denied" | "default"
    isSupported,     // Is FCM supported in this browser?
    isLoading,       // Is FCM initializing?
    requestPermission, // Function to request permission
  } = useFCM();

  return (
    <div>
      <p>Token: {token}</p>
      <p>Permission: {permission}</p>
    </div>
  );
}
```

### Custom Message Handler

To customize how foreground messages are displayed:

```tsx
import { useFCM } from "@/lib/hooks/useFCM";
import { MessagePayload } from "firebase/messaging";

function MyComponent() {
  useFCM({
    onMessage: (payload: MessagePayload) => {
      // Custom handling
      console.log("Received:", payload);
      // Show your custom UI
    }
  });

  return <div>My Component</div>;
}
```

## 🔌 Backend Integration

### Saving FCM Tokens

FCM tokens are automatically saved to your backend via the `saveFCMTokenToBackend` function. You'll need to create the API endpoint:

**Create**: `app/api/fcm/save-token/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token, userId } = await request.json();
  
  // TODO: Save to your database
  // Example:
  // await db.fcmTokens.create({
  //   data: { token, userId, createdAt: new Date() }
  // });
  
  return NextResponse.json({ success: true });
}
```

### Sending Notifications from Backend

To send notifications, use Firebase Admin SDK in your backend:

```typescript
// Example: Send notification when order is created
import * as admin from 'firebase-admin';

async function notifyOrderCreated(userId: string, orderId: string) {
  // Get user's FCM token from database
  const fcmToken = await db.fcmTokens.findFirst({
    where: { userId }
  });

  if (!fcmToken) return;

  const message = {
    notification: {
      title: 'Order Confirmed! 🎉',
      body: `Your order #${orderId} has been confirmed and is being prepared.`,
    },
    data: {
      type: 'order_created',
      orderId,
      url: `/profile/orders/${orderId}`,
    },
    token: fcmToken.token,
  };

  await admin.messaging().send(message);
}
```

## 🧪 Testing

### Local Testing (Development)

1. **Start dev server**: 
   ```bash
   npm run dev
   ```

2. **Open browser**: Navigate to `http://localhost:3000`

3. **Check console**: Look for FCM logs:
   ```
   [FCM Provider] Status: { isSupported: true, permission: "default", ... }
   ```

4. **Grant permission**: Click "Enable Notifications" when prompted

5. **Get test token**: Check console for "FCM Token obtained successfully"

### Testing Push Notifications

#### Option 1: Firebase Console (Easy)

1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and body
4. Under "Send test message", paste your FCM token
5. Click "Test"

#### Option 2: Using cURL (Advanced)

```bash
curl -X POST https://fcm.googleapis.com/v1/projects/meghana-dev/messages:send \
  -H "Authorization: Bearer YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "YOUR_FCM_TOKEN",
      "notification": {
        "title": "Test Notification",
        "body": "This is a test from cURL"
      }
    }
  }'
```

### Testing Background vs Foreground

- **Foreground**: Keep app open → Notification shows as toast
- **Background**: Minimize browser → Notification shows as system notification

## 🐛 Troubleshooting

### "Service Worker registration failed"

**Solution**: 
- Ensure `firebase-messaging-sw.js` is in the `public` directory
- Check browser console for specific errors
- Make sure you're accessing via `http://localhost` or `https://`

### "Failed to get FCM token"

**Solution**:
- Check if notification permission is granted
- Verify VAPID key is correct in `.env.local`
- Check browser console for errors
- Try in a different browser (Chrome/Firefox recommended)

### Notifications not appearing

**Solution**:
- Check browser notification settings (System → Notifications)
- Verify service worker is active (DevTools → Application → Service Workers)
- Check if notification permission is "granted"
- Look for errors in service worker console

### HTTPS Required Error

**Solution**:
- Service workers require HTTPS in production
- localhost works without HTTPS
- Use a hosting service with HTTPS support (Vercel, Netlify, etc.)

## 📊 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Best support |
| Firefox | ✅ Full | Good support |
| Safari  | ⚠️ Limited | iOS 16.4+ only |
| Edge    | ✅ Full | Chromium-based |
| Opera   | ✅ Full | Chromium-based |

## 🔒 Security Notes

1. **VAPID Key**: The public VAPID key is safe to expose in client-side code
2. **Server Key**: NEVER expose your Firebase Server Key in client code
3. **Token Storage**: FCM tokens are stored in localStorage and sent to backend
4. **HTTPS**: Always use HTTPS in production for service workers

## 📝 Next Steps

### Backend Integration Tasks

1. **Create API endpoints**:
   - `POST /api/fcm/save-token` - Save FCM tokens
   - `DELETE /api/fcm/delete-token` - Delete tokens on logout

2. **Database schema**:
   ```prisma
   model FCMToken {
     id        String   @id @default(cuid())
     token     String   @unique
     userId    String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     user      User     @relation(fields: [userId], references: [id])
   }
   ```

3. **Send notifications** on events:
   - Order created
   - Order status updated
   - Order cancelled
   - Promotional offers

### Frontend Enhancements

1. **Settings page**: Let users enable/disable notifications
2. **Notification preferences**: Choose which notifications to receive
3. **Sound preferences**: Custom notification sounds
4. **Do Not Disturb**: Time-based notification muting

## 🎓 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test in Chrome/Firefox first
4. Check Firebase Console for any project issues








