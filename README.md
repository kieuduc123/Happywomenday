# Happywomenday

## Firebase nhanh

1. Tao project Firebase va bat Firestore.
2. Copy `.env.example` thanh `.env.local`, dien cac key `VITE_FIREBASE_*`.
3. Tao Cloudinary upload preset o che do `Unsigned`, dien them:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
   - `VITE_CLOUDINARY_FOLDER` (tuy chon)
4. Rule Firestore don gian de test:

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

5. Chay lai `npm run dev` hoac deploy.

Khi Firebase ON + Cloudinary ON, trang `/edit` se luu online theo `slug`, gui link `/hongnhung` la may khac mo dung du lieu.
