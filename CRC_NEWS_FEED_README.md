# 📰 CRC News Feed System

## Overview

The CRC News Feed system provides real-time, AI-powered curation of colorectal cancer research articles and clinical developments from trusted medical sources worldwide. The system automatically fetches, analyzes, and ranks articles based on clinical relevance and regional importance.

## 🎯 Features

### ✅ Automated RSS Fetching
- **Sources**: Google News, PubMed, NEJM, JAMA, Reuters Health, Straits Times
- **Keywords**: Colorectal cancer, screening, early detection, polyp, Singapore, HSA
- **Frequency**: Daily updates (recommended: 3am)

### ✅ AI-Powered Analysis
- **GPT-4o Integration**: Generates 2-4 line clinical summaries
- **Relevance Scoring**: 1-10 scale based on screening/detection relevance
- **Regional Priority**: Singapore/APAC content gets higher relevance scores
- **Content Filtering**: Excludes lifestyle blogs, advertisements, unproven treatments

### ✅ Smart Ranking System
- **Sticky Articles**: High-priority studies (Kaiser Permanente, RAND) auto-pinned
- **Relevance-Based Ordering**: Articles sorted by clinical importance
- **Duplicate Detection**: Prevents duplicate articles from different sources
- **Date Prioritization**: Recent articles get priority within relevance tiers

### ✅ Professional UI/UX
- **Live Header Link**: Pulsating red dot indicates fresh content
- **Responsive Design**: Works on all devices
- **Search & Filter**: Find specific topics or sources
- **External Links**: Direct access to full articles
- **Loading States**: Professional skeleton loading

### ✅ Admin Management
- **Admin Panel**: `/admin/news` for authorized users
- **Sticky Control**: Pin/unpin important articles
- **Priority Management**: Control sticky article ordering
- **Manual Refresh**: Force RSS fetch and update
- **Article Overview**: View all articles with relevance scores

## 🏗️ Architecture

### Database Schema
```sql
-- Supabase table: crc_news_feed
CREATE TABLE public.crc_news_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source text,
  link text UNIQUE,
  summary text,
  date_published timestamp with time zone,
  relevance_score integer CHECK (relevance_score >= 1 AND relevance_score <= 10),
  is_sticky boolean DEFAULT false,
  sticky_priority integer DEFAULT 999,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Key Components

1. **CRCNewsFeedService** (`src/services/crcNewsFeedService.ts`)
   - RSS parsing with CORS proxy
   - OpenAI GPT-4o integration for summaries
   - Relevance scoring algorithm
   - Supabase CRUD operations

2. **CRCNewsFeedPage** (`src/pages/newsroom/CRCNewsFeedPage.tsx`)
   - Main public feed interface
   - Search and filtering
   - Responsive card layout
   - Real-time loading states

3. **NewsFeedAdmin** (`src/pages/admin/NewsFeedAdmin.tsx`)
   - Admin interface for content management
   - Sticky article control
   - Manual refresh capabilities
   - Article deletion and moderation

4. **Header Integration** (`src/components/Header.tsx`)
   - Live CRC News link with pulsating indicator
   - Mobile-responsive navigation
   - Tooltip with descriptive text

## 🚀 Deployment Instructions

### 1. Database Setup
```bash
# Apply migration to create table
npx supabase db reset
# or manually run the SQL in supabase/migrations/20250804_create_crc_news_feed.sql
```

### 2. Environment Variables
```env
# Required for AI summaries
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Required for RSS fetching (optional alternative)
RSS2JSON_API_KEY=your_rss2json_key_here

# Required for CRON security
CRON_SECRET=your_secure_cron_secret_here
```

### 3. Daily CRON Setup

#### Option A: Supabase Edge Function (Recommended)
```typescript
// Create edge function at supabase/functions/daily-news-fetch/index.ts
import { handler } from '../../../src/scripts/dailyNewsFetch.ts';
Deno.serve(handler);
```

#### Option B: Vercel Cron Job
```typescript
// pages/api/cron/daily-news.ts
import dailyNewsFetch from '../../../src/scripts/dailyNewsFetch';
export default async function handler(req: any, res: any) {
  // Add auth check
  await dailyNewsFetch();
  res.status(200).json({ success: true });
}
```

#### Option C: Server CRON
```bash
# Add to crontab (runs daily at 3am)
0 3 * * * /usr/bin/node /path/to/dailyNewsFetch.js
```

### 4. Route Configuration
Routes are automatically configured in `src/routes.tsx`:
- `/newsroom/crc-news-feed` - Public feed page
- `/admin/news` - Admin management (requires authentication)

## 🔧 Usage

### Public Access
1. Navigate to `/newsroom/crc-news-feed`
2. View AI-summarized articles sorted by relevance
3. Use search to find specific topics
4. Click "Read Full Article" for complete source content

### Admin Access
1. Sign in as admin user
2. Navigate to `/admin/news`
3. **Pin Articles**: Click "Pin" to make articles sticky
4. **Refresh Feed**: Click "Refresh Feed" to fetch latest articles
5. **Delete Articles**: Remove irrelevant or duplicate content

### Header Navigation
- **Desktop**: Look for "📰 Live CRC News" with pulsating red dot
- **Mobile**: Accessible through hamburger menu
- **Tooltip**: Hover for description of feed content

## 📊 Content Intelligence

### Relevance Scoring (1-10)
- **9-10**: Major breakthroughs, Singapore/APAC content, policy changes
- **7-8**: Significant clinical findings, new screening methods
- **5-6**: General CRC research, routine updates
- **3-4**: Tangentially related content
- **1-2**: Not medically relevant (auto-filtered out)

### Auto-Sticky Criteria
- Relevance score ≥ 9
- Contains keywords: "Kaiser Permanente", "RAND study", "Singapore", "mortality reduction"
- Major clinical trials or policy announcements

### Content Filtering
**Included**: Medical journals, health authorities, clinical studies, screening research
**Excluded**: Lifestyle blogs, advertisements, supplements, unproven treatments

## 🔒 Security & Privacy

- **RLS Policies**: Public read access, authenticated write access
- **CRON Protection**: Bearer token authentication for scheduled tasks
- **Admin Routes**: Protected by ProtectedAdminRoute component
- **Data Sanitization**: All content is sanitized before storage
- **External Links**: Open in new tabs with security attributes

## 🛠️ Development

### Mock Data
For development/testing, mock data is available in `crcNewsFeedService.ts`:
```typescript
import { mockCRCNews } from '../services/crcNewsFeedService';
```

### Local Testing
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### API Testing
```typescript
// Test the service directly
import { crcNewsFeedService } from './src/services/crcNewsFeedService';

// Fetch articles
const articles = await crcNewsFeedService.getNewsArticles();

// Refresh feed
await crcNewsFeedService.fetchAndStoreNews();
```

## 📈 Performance

- **Database Indexing**: Optimized for relevance/sticky/date ordering
- **Deduplication**: Prevents duplicate articles across sources
- **Rate Limiting**: 1-second delays between AI summary requests
- **Pagination**: Limits initial load to 50 articles
- **Caching**: Browser-level caching for images and assets

## 🔄 Maintenance

### Regular Tasks
1. **Monitor Relevance Scores**: Check if AI scoring is accurate
2. **Review Sticky Articles**: Ensure high-priority content is properly pinned
3. **Source Validation**: Verify RSS feeds are still active
4. **Content Moderation**: Remove irrelevant or outdated articles

### Troubleshooting
- **No Articles Loading**: Check Supabase connection and table exists
- **AI Summaries Missing**: Verify OpenAI API key is configured
- **RSS Fetch Failing**: Check CORS proxy service availability
- **Admin Access Denied**: Verify user has admin role in Supabase

## 🎯 Future Enhancements

- **Email Notifications**: Daily digest for subscribed users
- **Category Filtering**: Treatment, Prevention, Research, Policy
- **Bookmark System**: Allow users to save articles
- **Share Features**: Social media integration
- **Analytics Dashboard**: Track most popular articles
- **Multi-language Support**: Translate summaries to local languages

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: August 4, 2025  
**Version**: 1.0.0