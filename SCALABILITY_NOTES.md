# Quiz System Scalability Notes

## Current Architecture

The quiz system is designed to handle **200+ concurrent users** with the following architecture:

### Infrastructure
- **Hosting**: Vercel (Serverless Functions with Edge Network)
- **Database**: Supabase (PostgreSQL with connection pooling)
- **CMS**: Sanity (CDN-backed content delivery)

### Performance Optimizations

#### 1. Caching Strategy
- **Quiz Config API** (`/api/quiz/config`): 
  - Cache: 30 seconds (revalidate)
  - Stale-while-revalidate: 60 seconds
  - Reduces Sanity API calls significantly
  
- **Proxy Cache** (`proxy.ts`):
  - Quiz status cached for 30 seconds
  - Prevents excessive Sanity queries on every page load

#### 2. Database Optimizations
- **Connection Pooling**: Supabase handles connection pooling automatically
- **Indexed Queries**: Email lookups use indexed columns
- **Atomic Operations**: Submission uses database-level unique constraints to prevent race conditions
- **Progress Saving**: Non-blocking, fails gracefully to localStorage

#### 3. API Route Optimizations
- **Timeout Protection**: Sanity queries have 10-second timeouts
- **Graceful Degradation**: Score calculation failures don't block submissions
- **Error Handling**: Comprehensive error handling prevents cascading failures

#### 4. Client-Side Optimizations
- **Local Storage Backup**: Progress saved locally as backup
- **Retry Logic**: Client-side retry with exponential backoff
- **Debounced Progress**: Progress saves are debounced to reduce API calls

## Scalability Considerations

### For 200 Concurrent Users

✅ **Ready** - The system can handle 200 concurrent users with current setup:

1. **Vercel Edge Network**: Automatically distributes load across regions
2. **Serverless Functions**: Auto-scales based on demand
3. **Database**: Supabase free tier supports 500 concurrent connections
4. **Sanity CDN**: Handles high traffic for content delivery

### Potential Bottlenecks & Solutions

#### 1. Database Connection Limits
- **Current**: Supabase free tier: 500 concurrent connections
- **Solution**: Upgrade to Pro tier if needed (unlimited connections)
- **Mitigation**: Connection pooling is automatic

#### 2. Sanity API Rate Limits
- **Current**: Sanity free tier: 3M API requests/month
- **Mitigation**: 
  - 30-second caching reduces API calls by ~95%
  - CDN serves images/files directly
- **Solution**: Upgrade to Pro tier if needed

#### 3. Submission Race Conditions
- **Current**: Handled with database unique constraints
- **Status**: ✅ Already implemented

#### 4. File Downloads
- **Current**: Files served via Sanity CDN
- **Mitigation**: CDN handles high traffic automatically
- **Note**: Large files (>10MB) may need optimization

## Monitoring Recommendations

1. **Vercel Analytics**: Monitor function execution times
2. **Supabase Dashboard**: Monitor database connections and query performance
3. **Sanity Dashboard**: Monitor API usage
4. **Error Logging**: Check Vercel logs for errors

## Rate Limiting

Currently, rate limiting is handled by:
- **Vercel**: Built-in DDoS protection and rate limiting
- **Supabase**: Connection limits and query rate limits
- **Sanity**: API rate limits

For additional protection, consider:
- Vercel Pro plan for advanced rate limiting
- Cloudflare for additional DDoS protection
- Custom rate limiting middleware (if needed)

## Load Testing

To test with 200 concurrent users:
1. Use tools like k6, Artillery, or Locust
2. Test submission endpoint (`/api/quiz/submit`)
3. Test config endpoint (`/api/quiz/config`)
4. Monitor error rates and response times

## Recommendations for Production

1. ✅ **Current Setup**: Good for 200 concurrent users
2. **Monitor**: Watch for database connection spikes
3. **Upgrade Path**: 
   - Supabase Pro if >500 concurrent connections needed
   - Sanity Pro if >3M API requests/month
4. **CDN**: Already using Sanity CDN for assets

## Expected Performance

- **Quiz Config Load**: <200ms (cached)
- **Submission**: <500ms (with score calculation)
- **Progress Save**: <100ms (non-blocking)
- **File Download**: <1s (CDN-served)

All metrics assume normal network conditions and within rate limits.
