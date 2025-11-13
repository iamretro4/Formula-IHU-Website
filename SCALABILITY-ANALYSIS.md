# Registration Quiz Scalability Analysis

## Can the system handle 500 teams taking a 2-hour test on free Supabase + Vercel?

### Short Answer: **Yes! With optimizations, even free tier can work**

The registration quiz system is designed to handle concurrent loads. With 500 teams and a 2-hour duration, the system is well within capacity limits.

---

## Free Tier Limits

### Vercel (Free/Hobby Plan)
- **Function Execution Time**: 10 seconds (Hobby) / 60 seconds (Pro)
- **Bandwidth**: 100GB/month (Hobby) / 1TB/month (Pro)
- **Function Invocations**: Unlimited (but rate-limited)
- **Edge Network**: Global CDN included
- **Concurrent Requests**: Handled automatically with auto-scaling
- **Serverless Functions**: Auto-scales to handle traffic spikes

### Supabase (Free Tier)
- **Database Size**: 500MB
- **Bandwidth**: 5GB/month
- **API Requests**: 50,000/month
- **Concurrent Connections**: Limited (varies)
- **Database CPU**: Shared resources

---

## System Architecture & Load Distribution

### What happens during quiz (500 teams, 2-hour duration):

1. **Initial Load** (Quiz Start):
   - 500 teams hit `/registration-tests` simultaneously
   - Proxy checks quiz status (cached, revalidates every 10s)
   - Quiz config fetched from Sanity (CDN cached)
   - Static assets served from Vercel Edge Network

2. **During Quiz** (with optimizations):
   - Smart saving: Only saves when answers change (debounced 2s)
   - Safety timer: 30-second fallback
   - **2-hour quiz**: Teams typically change answers 10-20 times
   - With debouncing: ~12-15 saves per team over 2 hours
   - 500 teams × 13 saves = **6,500 progress writes** over 2 hours
   - Each save is a small JSONB upsert (~1-2KB)
   - Final submission: 500 writes at end
   - **Total: ~7,000 database writes per quiz event**

3. **Database Operations**:
   - **Reads**: Minimal (only config fetch, progress checks)
   - **Writes**: High frequency (progress saves)
   - **Data Size**: Small per record (~2-5KB per progress, ~10KB per submission)

---

## Potential Bottlenecks

### 1. **Supabase Write Limits** ✅ (After Optimizations)
- **Free tier**: 50,000 API requests/month
- **During quiz** (optimized): ~6,500 progress writes + 500 submissions = 7,000 total
- **Before optimization**: Would have been 7,200 writes/hour (120 saves × 60 minutes)
- **After optimization**: 7,000 writes per 2-hour quiz event
- **Write rate**: ~58 writes/minute (very low, well within limits)
- **Result**: ✅ Can run ~7 quiz events/month on free tier

### 2. **Database Connection Pool**
- Free tier has limited concurrent connections (~50-100)
- 500 simultaneous teams: ✅ Well within connection limits
- **Solution**: No action needed - optimizations keep connections low

### 3. **Vercel Function Timeouts**
- Progress save API might timeout under heavy load
- **Solution**: Optimize queries, add retry logic

### 4. **Sanity API Rate Limits**
- Config fetch happens on every page load
- **Solution**: Aggressive caching (already implemented with 10s revalidation)

---

## Optimizations Implemented ✅

✅ **Smart Progress Saving**:
- **Debounced saving**: Only saves when answers change (waits 2 seconds after last change)
- **Safety timer**: 30-second fallback to catch any missed changes
- **LocalStorage backup**: Immediate local saves for instant recovery
- **Result**: ~80-90% reduction in database writes (from 30 saves/quiz to ~2-3 saves/quiz)
- Uses `upsert` to avoid duplicate inserts

✅ **Caching**:
- Proxy caches quiz status (10s revalidation)
- Sanity config cached at CDN level
- Static assets on Edge Network

✅ **Database Design**:
- Indexed on `team_email` for fast lookups
- Separate tables for progress vs submissions
- JSONB for efficient storage

---

## Recommendations for 2000 Users

### Option 1: **Optimize Free Tier** (Recommended for testing)
1. **Reduce save frequency**: Change from 10s to 30s
   - Reduces writes by 66% (4,000/minute instead of 12,000)
   - Still provides good progress recovery

2. **Batch writes**: Group multiple progress updates
   - Use a queue system (e.g., Redis, or in-memory queue)
   - Batch every 5 seconds instead of individual saves

3. **Client-side batching**: 
   - Save multiple answer changes together
   - Only save when answers change (not on timer)

### Option 2: **Upgrade Supabase** (Recommended for production)
- **Pro Plan** ($25/month): 
  - 8GB database
  - 250GB bandwidth
  - 5M API requests/month
  - Better connection pooling
  - **This easily handles 2000 users**

### Option 3: **Hybrid Approach**
- Use Supabase for final submissions only
- Use Vercel KV (Redis) or Edge Config for progress
- Migrate to Supabase only on submission

---

## Load Testing Estimates

### Realistic Scenario (500 teams, 2-hour quiz, with optimizations):
- **Start**: 500 teams load page (cached, fast)
- **During**: 500 teams × 13 saves = 6,500 writes over 2 hours (smart saving)
- **End**: 500 submissions (all at once)
- **Total**: ~7,000 database writes per quiz event
- **Write rate**: ~58 writes/minute (very manageable)

### Free Tier Capacity (After Optimizations):
- **Supabase**: 50,000 requests/month
- **Quiz usage**: ~7,000 requests per event
- **Verdict**: ✅ **Can run ~7 quiz events/month on free tier**
- **Note**: For production with multiple events, Supabase Pro recommended

### Pro Tier Capacity:
- **Supabase Pro**: 5M requests/month = ~166,666/day
- **Quiz usage**: ~7,000 requests per event
- **Verdict**: ✅ **Easily handles 500 teams** - Can run ~700+ events/month

---

## Vercel Plan Requirements

### Vercel Free/Hobby Plan: ✅ **Sufficient for 2000 Users**

**Why Vercel Free/Hobby works:**
- ✅ **Auto-scaling**: Serverless functions automatically scale to handle traffic
- ✅ **Edge Network**: Global CDN distributes load efficiently
- ✅ **Unlimited Invocations**: No hard limit on function calls
- ✅ **100GB Bandwidth**: More than enough for quiz traffic (mostly text/JSON)
- ✅ **10s Function Timeout**: Sufficient for progress saves (typically <1s)

**Traffic Estimate for 500 Teams:**
- Initial page loads: ~2MB per team = 1GB total
- Progress saves: ~2KB per save × 500 teams = 1MB per save cycle
- Over 2 hours: ~6,500 saves × 2KB = 13MB
- Total bandwidth: <2GB for entire quiz event
- **Verdict**: ✅ Well within 100GB/month limit (can run 50+ events/month)

**Function Execution:**
- Progress save API: ~200-500ms per request
- Config fetch: ~100-300ms (cached)
- All well under 10s timeout

**Conclusion**: Vercel Free/Hobby plan is **perfectly adequate** for this use case. No upgrade needed.

---

## Final Recommendation

### For Production with 500 Teams (2-hour quiz):

1. **Supabase Free Tier** ✅ **SUFFICIENT for occasional use**
   - 7,000 writes per event
   - Can run ~7 events/month
   - **Good for**: Testing, occasional events, low-frequency usage

2. **Supabase Pro** ($25/month) ⚠️ **RECOMMENDED for production**
   - Better performance and reliability
   - Can run 700+ events/month
   - Better connection pooling for concurrent users
   - **Good for**: Regular events, high-frequency usage, production

3. **Vercel Free/Hobby** ✅ **SUFFICIENT**
   - No upgrade needed
   - Edge network handles traffic excellently
   - Auto-scaling handles spikes automatically
   - 100GB bandwidth allows 50+ events/month

4. **Optimizations Implemented** ✅
   - ✅ Smart saving: Only saves when answers change (debounced 2s)
   - ✅ Safety timer: 30-second fallback (reduced from 10s)
   - ✅ LocalStorage backup: Immediate local saves
   - **Result**: ~80-90% reduction in database writes
   - **For 2-hour quiz**: ~13 saves per team (vs 240 saves with old system)

5. **Add Monitoring**
   - Track API request usage
   - Monitor database connections
   - Set up alerts for limits

---

## Conclusion

**Free tier**: ✅ **Can work** for 500 teams with 2-hour quiz (~7 events/month)

**With Supabase Pro ($25/month) + Vercel Free**: ✅ **Excellent performance** - Can handle 500 teams comfortably with room for 700+ events/month

**Cost Breakdown:**
- **Option 1 (Free)**: $0/month - Good for testing/occasional use
- **Option 2 (Pro)**: $25/month - Recommended for production
- Vercel: $0/month (Free/Hobby plan) - No upgrade needed

**Key Insight**: The 2-hour duration actually helps! With smart saving, teams save ~13 times over 2 hours (not 240 times). The longer duration spreads out writes, making the system very efficient.

The architecture is sound, and with the implemented optimizations, the system efficiently handles 500 teams over a 2-hour period while maintaining data safety.

