# Happywomenday

## Firebase nhanh

1. Tao project Firebase va bat Firestore.
2. Copy `.env.example` thanh `.env.local`, dien cac key `VITE_FIREBASE_*`.
3. Rule Firestore don gian de test:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gifts/{slug} {
      allow read, write: if true;
    }
  }
}
```

4. Chay lai `npm run dev` hoac deploy.

Khi Firebase ON, trang `/edit` se luu online theo `slug`, gui link `/hongnhung` la may khac mo dung du lieu.
