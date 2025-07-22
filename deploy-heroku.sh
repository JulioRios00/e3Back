#!/bin/bash

# 🚀 Deploy E3Audio API to Heroku with Sentry Monitoring

echo "🔧 Setting up Heroku environment variables..."

# Set production environment
heroku config:set NODE_ENV=production --app e3-api-d64fcc5bd009

# Set Sentry DSN (replace with your actual DSN from bravotech.sentry.io)
echo "📊 Setting up Sentry monitoring..."
heroku config:set SENTRY_DSN="https://your-actual-dsn@bravotech.sentry.io/project-id" --app e3-api-d64fcc5bd009

# Set JWT secret for production
heroku config:set JWT_SECRET="your-production-jwt-secret-change-this" --app e3-api-d64fcc5bd009
heroku config:set JWT_EXPIRES_IN="7d" --app e3-api-d64fcc5bd009

# Database URL should already be set by Heroku Postgres addon
# heroku config:set DATABASE_URL="..." --app e3-api-d64fcc5bd009

echo "📋 Current environment variables:"
heroku config --app e3-api-d64fcc5bd009

echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Add Sentry monitoring and production configuration"
git push heroku main

echo "📊 Checking deployment logs..."
heroku logs --tail --app e3-api-d64fcc5bd009

echo "✅ Deployment complete!"
echo "🌐 API URL: https://e3-api-d64fcc5bd009.herokuapp.com/"
echo "🧪 Health Check: https://e3-api-d64fcc5bd009.herokuapp.com/test/health"
echo "📊 Test Sentry: https://e3-api-d64fcc5bd009.herokuapp.com/test/sentry"
