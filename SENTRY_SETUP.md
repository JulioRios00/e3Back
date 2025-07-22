# 🔧 Sentry Setup Instructions for E3Audio API

## Step 1: Get Your Sentry DSN

1. **Visit the BravoTech Sentry Organization**
   - Go to: https://bravotech.sentry.io/
   - Sign in with your credentials

2. **Find Your Project**
   - Look for your E3Audio/Backend project
   - Or create a new project if needed

3. **Get Your DSN**
   - Go to **Settings** → **Projects** → **[Your Project]**
   - Click on **Client Keys (DSN)**
   - Copy the DSN that looks like: `https://xxxxx@bravotech.sentry.io/xxxxx`

4. **Update Your .env File**
   ```bash
   SENTRY_DSN="https://your-actual-dsn@bravotech.sentry.io/project-id"
   ```

## Step 2: Test Sentry Integration

Once you've updated your `.env` file with the real DSN:

1. **Start your application**
   ```bash
   pnpm run start:dev
   ```

2. **Test endpoints** (these will send data to Sentry):
   ```bash
   # Test basic Sentry message
   curl http://localhost:3000/test/sentry
   
   # Test error capture
   curl http://localhost:3000/test/error
   
   # Test performance monitoring (slow endpoint)
   curl -X POST http://localhost:3000/test/slow -H "Content-Type: application/json" -d '{"test": "data"}'
   ```

## Step 3: Verify in Sentry Dashboard

Check your Sentry dashboard for:
- ✅ Test messages in **Issues**
- ✅ Error captures with stack traces
- ✅ Performance data showing slow endpoints
- ✅ User context for registration errors

## Step 4: Monitor Real Errors

Your registration endpoint now captures:
- Email conflicts with user email context
- Database connection errors
- Validation failures
- Unexpected server errors

## What You Get:
- 📊 **Real-time error tracking**
- 🐛 **Detailed stack traces**
- 👤 **User context** (email, operation type)
- ⚡ **Performance monitoring**
- 📧 **Email alerts** for new errors
- 📈 **Error trends and analytics**

## Remove Test Endpoints (Production)
After testing, you can remove the TestModule from `app.module.ts` for production deployment.
