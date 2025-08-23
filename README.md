# 🎨 Artopia - Artist Community Platform

A beautiful social media platform designed specifically for artists to share their work, connect with others, and build their creative community.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password signup and login
- 📸 **Instagram-style Feed** - Beautiful image grid with author navigation
- 👤 **LinkedIn-style Profiles** - Showcase your artistic journey
- 💬 **Real-time Chat** - Private messaging between artists
- 📱 **PWA Support** - Install on mobile devices
- 🎯 **Verification System** - Earn badges with 4+ posts
- 🎨 **Responsive Design** - Perfect on all devices

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL and anon public key
   - Copy `.env.example` to `.env`
   - Update `.env` with your actual Supabase credentials

3. **Set up the database:**
   - Run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
   - Run the SQL in `supabase/storage.sql` to set up storage buckets

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Supabase Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (this takes a few minutes)

### 2. Update Configuration
Copy `.env.example` to `.env` and update with your Supabase credentials:

```bash
cp .env.example .env
```

Then edit `.env`:
```
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

You can find these values in your Supabase dashboard:
- Go to Settings → API
- Copy the "Project URL" and "anon public" key

### 3. Set Up Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to create all tables and security policies

### 4. Set Up Storage
1. In the SQL Editor, run the contents of `supabase/storage.sql`
2. This creates the storage buckets for posts and avatars

### 5. Configure Authentication
1. Go to Authentication → Settings
2. Turn OFF "Enable email confirmations" for easier testing
3. (Optional) Set up custom SMTP for production

## 📚 Database Schema

### Tables
- **profiles** - User profile information
- **posts** - User posts with images and captions  
- **chats** - Chat conversations between users
- **messages** - Individual messages in chats

### Storage Buckets
- **posts** - User post images
- **avatars** - User profile pictures

## 🌱 Seed Data

To create test data for development:

1. Update `seed.js` with your Supabase service role key
2. Install Node.js dependencies: `npm install @supabase/supabase-js`
3. Run: `node seed.js`

This creates two test accounts:
- **alice@example.com** (password: password123)
- **bob@example.com** (password: password123)

## 🏗️ Build and Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
3. Or connect your GitHub repo for automatic deployments

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🔐 Security Notes

**⚠️ Important for Production:**
- The Supabase anon key is safe to use in client-side code
- Set up proper domain restrictions in Supabase dashboard
- Use environment variables for sensitive keys in production
- Enable RLS (Row Level Security) policies are already configured

## 🛠️ Debugging Checklist

1. ✅ **Supabase Connection**
   - Check URL and anon key in `src/lib/supabase.js`
   - Test connection in browser network tab

2. ✅ **Authentication**
   - Sign up with test email
   - Check if profile is created in database
   - Verify redirect to `/app` after login

3. ✅ **Database Tables**
   - Run schema migration SQL
   - Check tables exist in Supabase dashboard
   - Verify RLS policies are enabled

4. ✅ **Storage Setup**
   - Create posts and avatars buckets
   - Set public read policies
   - Test image upload in create post

5. ✅ **Feed Display**
   - Upload a test post
   - Check image displays correctly
   - Click author name to navigate to profile

6. ✅ **Profile Pages**
   - View your own profile
   - Edit profile information
   - Check verification badge with 4+ posts

7. ✅ **Real-time Chat**
   - Start chat from another user's profile
   - Send test messages
   - Check real-time message updates

8. ✅ **PWA Installation**
   - Test on mobile device
   - Check install prompt appears
   - Verify offline functionality

9. ✅ **Navigation**
   - Test all bottom nav tabs
   - Check smooth transitions
   - Verify protected routes work

10. ✅ **Image Upload**
    - Test image selection
    - Check file size limits (5MB)
    - Verify image compression

11. ✅ **Responsive Design**
    - Test on mobile, tablet, desktop
    - Check all components adapt properly
    - Verify touch targets are adequate

12. ✅ **Error Handling**
    - Test with no internet connection
    - Check auth error messages
    - Verify upload failure handling

## 📱 PWA Installation

The app includes PWA (Progressive Web App) support:

1. **Android Chrome:**
   - Visit the site
   - Tap "Add to Home Screen" when prompted
   - Icon will appear on home screen

2. **iOS Safari:**
   - Tap share button
   - Select "Add to Home Screen"
   - Enter app name and confirm

## 🎨 Design System

### Colors
- Primary: `#FF6B6B` (coral)
- Accent: `#4F46E5` (indigo)  
- Backgrounds: White, soft grays
- Text: Proper contrast ratios

### Spacing
- Base unit: 4px (p-4, gap-4)
- Rounded corners: 2xl (rounded-2xl)
- Consistent padding throughout

### Typography
- Font weights: 400, 500, 600, 700
- Line height: 1.5 for body, 1.2 for headings
- Clear hierarchy with appropriate sizes

## 🔄 Real-time Features

The app uses Supabase real-time subscriptions for:
- **Live chat messaging** - Messages appear instantly
- **Auto-updating feeds** - New posts appear without refresh
- **Presence indicators** - See when users are online (can be added)

## 📈 Performance

- **Lazy loading** for images
- **Optimized bundles** with Vite
- **Efficient queries** with Supabase
- **Cached static assets** via service worker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**One-line quickstart:** `npm install && npm run dev` (after updating Supabase config)