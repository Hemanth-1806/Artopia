# 🐛 Artopia Debugging Checklist

Use this checklist to systematically test and debug the application. Check each item when verified working.

## 1. ⚙️ Initial Setup
- [ ] Supabase project created and active
- [ ] Database schema applied (`001_initial_schema.sql`)
- [ ] Storage buckets created (`storage.sql`)
- [ ] `.env` file created from `.env.example`
- [ ] `.env` updated with correct Supabase URL and anon key
- [ ] No console errors about missing environment variables
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts without errors (`npm run dev`)

## 2. 🔐 Authentication System
- [ ] Landing page displays correctly at `/`
- [ ] Can navigate to `/auth` page
- [ ] Sign up form accepts new user registration
- [ ] Profile is automatically created in database after signup
- [ ] Sign in form works with created credentials
- [ ] Successful auth redirects to `/app`
- [ ] Sign out button works and redirects to `/auth`
- [ ] Protected routes block unauthenticated access

## 3. 📸 Feed Functionality
- [ ] Feed displays at `/app` (may be empty initially)
- [ ] "No posts yet" message shows when feed is empty
- [ ] Loading spinner appears while fetching posts
- [ ] Seed data creates sample posts if run
- [ ] Posts display with proper image aspect ratios
- [ ] Author overlay shows on bottom-left of images
- [ ] Clicking author name navigates to their profile
- [ ] Images load with lazy loading

## 4. ➕ Post Creation
- [ ] Create post page accessible at `/app/create`
- [ ] Image upload area displays properly
- [ ] File picker opens when clicking upload area
- [ ] Image preview shows after selecting file
- [ ] File size validation works (5MB limit)
- [ ] File type validation works (images only)
- [ ] Caption field accepts text input (500 char limit)
- [ ] Submit button disabled until image selected
- [ ] Upload process shows loading state
- [ ] Successful upload redirects to feed
- [ ] New post appears in feed immediately

## 5. 👤 Profile Pages
- [ ] Own profile accessible at `/app/profile`
- [ ] Profile shows display name, bio, location, artforms
- [ ] Post count displays correctly
- [ ] Profile picture shows (or default avatar)
- [ ] Edit button appears on own profile
- [ ] Edit form allows updating profile fields
- [ ] Changes save successfully
- [ ] Verification badge appears with 4+ posts
- [ ] Other users' profiles accessible at `/app/profile/:userId`
- [ ] Message button appears on other profiles
- [ ] Posts grid displays user's posts

## 6. 💬 Chat System
- [ ] Chats list accessible at `/app/chats`
- [ ] "No conversations" message when empty
- [ ] Can start chat from another user's profile
- [ ] Chat appears in chats list after creation
- [ ] Chat detail opens when clicking chat item
- [ ] Can send messages in chat
- [ ] Messages appear immediately after sending
- [ ] Messages show correct timestamp
- [ ] Own messages appear on right (colored)
- [ ] Other messages appear on left (white)
- [ ] Real-time updates work (test with two browsers)
- [ ] Chat list updates with latest message

## 7. 🧭 Navigation
- [ ] Bottom navigation shows 4 tabs
- [ ] Active tab highlighted correctly
- [ ] All navigation links work smoothly
- [ ] Back buttons work where present
- [ ] URL changes reflect current page
- [ ] Browser back/forward buttons work
- [ ] Deep linking works (refresh on any page)

## 8. 📱 Responsive Design
- [ ] Landing page looks good on mobile (375px width)
- [ ] Landing page looks good on tablet (768px width)
- [ ] Landing page looks good on desktop (1200px+ width)
- [ ] App interface optimized for mobile-first
- [ ] All buttons and touch targets are adequate size (44px+)
- [ ] Text remains readable at all screen sizes
- [ ] Images scale properly on all devices
- [ ] Navigation works well on mobile

## 9. 🔄 PWA Features
- [ ] Manifest file loads correctly (`/manifest.json`)
- [ ] Service worker registers without errors
- [ ] Install prompt appears on supported devices
- [ ] App can be added to home screen
- [ ] App icon displays correctly when installed
- [ ] Basic offline functionality works
- [ ] Theme color appears in status bar

## 10. 🎨 Visual Design
- [ ] Color scheme consistent (coral/indigo)
- [ ] Proper spacing (p-4, gap-4) throughout
- [ ] Rounded corners consistent (rounded-2xl)
- [ ] Hover states work on interactive elements
- [ ] Loading states show appropriate feedback
- [ ] Error states display helpful messages
- [ ] Typography hierarchy is clear
- [ ] Contrast ratios meet accessibility standards

## 11. ⚡ Performance
- [ ] Initial page load under 3 seconds
- [ ] Images load with lazy loading attribute
- [ ] No console errors in browser devtools
- [ ] No 404s for resources in network tab
- [ ] Database queries complete quickly
- [ ] Image uploads process efficiently
- [ ] Real-time updates don't cause lag

## 12. 🔒 Security & Data
- [ ] Row Level Security policies enforced
- [ ] Users can only edit their own content
- [ ] Users can only see their own chats
- [ ] Authentication required for all app routes
- [ ] File upload restrictions work properly
- [ ] No sensitive data exposed in client
- [ ] Storage permissions configured correctly

## 🚨 Common Issues & Solutions

### Authentication Not Working
- Check Supabase URL and anon key are correct
- Verify email confirmation is disabled in Supabase auth settings
- Check browser network tab for 401 errors

### Images Not Uploading
- Verify storage buckets exist in Supabase
- Check storage policies allow authenticated uploads
- Ensure file size under 5MB

### Real-time Chat Not Working
- Verify Supabase real-time is enabled for your project
- Check browser network tab for websocket connections
- Test with two different browsers/devices

### Database Errors
- Ensure all migrations have been applied
- Check Row Level Security policies are enabled
- Verify foreign key relationships are correct

### Build/Deploy Issues
- Run `npm run build` to check for TypeScript errors
- Ensure all environment variables are set for production
- Check that all imports use correct file extensions

---

**✅ All items checked?** Your Artopia app should be working perfectly!