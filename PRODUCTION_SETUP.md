# FreightFloo Production Setup Guide

## Overview

This guide will help you deploy FreightFloo to production using Google Cloud Platform.

## Prerequisites

1. Google Cloud Project with billing enabled
2. Cloud Run API enabled
3. Cloud Build API enabled
4. Secret Manager API enabled
5. PostgreSQL database (Cloud SQL recommended)

## Step 1: Set up Google Cloud Secrets

Create the following secrets in Google Secret Manager:

```bash
# NEXTAUTH_SECRET - Generate a secure random string
echo -n "your-super-secure-random-string-here" | gcloud secrets create NEXTAUTH_SECRET --data-file=-

# DATABASE_URL - Your PostgreSQL connection string
echo -n "postgresql://username:password@host:port/database" | gcloud secrets create DATABASE_URL --data-file=-

# RESEND_API_KEY - Your Resend email service API key
echo -n "re_your_resend_api_key" | gcloud secrets create RESEND_API_KEY --data-file=-
```

## Step 2: Set up PostgreSQL Database

1. Create a Cloud SQL PostgreSQL instance
2. Create a database named `freightfloo_prod`
3. Note the connection details for the DATABASE_URL

## Step 3: Deploy to Cloud Run

```bash
# Deploy using Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly
gcloud run deploy freightfloo-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production \
  --set-secrets NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest,DATABASE_URL=DATABASE_URL:latest,RESEND_API_KEY=RESEND_API_KEY:latest
```

## Step 4: Run Database Migrations

After deployment, run the database migrations:

```bash
# Connect to your Cloud Run service and run migrations
gcloud run services proxy freightfloo-app --port=8080
# Then in another terminal:
npx prisma db push
```

## Step 5: Verify Deployment

1. Check the health endpoint: `https://your-app-url/api/health-check`
2. Test authentication: `https://your-app-url/auth/signin`
3. Test forgot password: `https://your-app-url/auth/forgot-password`

## Environment Variables

### Required for Production:

- `NODE_ENV=production`
- `NEXTAUTH_URL=https://your-domain.com`
- `NEXTAUTH_SECRET` (secure random string)
- `DATABASE_URL` (PostgreSQL connection string)
- `RESEND_API_KEY` (for email functionality)

### Optional:

- `STRIPE_PUBLISHABLE_KEY` (for payments)
- `STRIPE_SECRET_KEY` (for payments)
- `STRIPE_WEBHOOK_SECRET` (for payments)
- `NEXT_PUBLIC_GA_ID` (for analytics)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (for maps)

## Troubleshooting

### Common Issues:

1. **Build fails with TypeScript errors**: Make sure all TypeScript errors are fixed locally
2. **Database connection fails**: Verify DATABASE_URL secret is correct
3. **Email not working**: Check RESEND_API_KEY is valid
4. **Authentication issues**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL

### Logs:

```bash
# View Cloud Run logs
gcloud logs read --service=freightfloo-app --limit=50
```

## Security Notes

1. Never commit `.env` files to version control
2. Use Google Secret Manager for sensitive data
3. Enable Cloud Armor for DDoS protection
4. Use HTTPS only in production
5. Regularly rotate secrets

## Monitoring

Set up monitoring for:

- Application health
- Database performance
- Error rates
- Response times
- Authentication failures
