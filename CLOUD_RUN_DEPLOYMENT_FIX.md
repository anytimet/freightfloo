# Cloud Run Deployment Fix Guide

## Issues Fixed

### 1. Environment Variables Configuration

- **Problem**: Missing `DATABASE_URL` and `RESEND_API_KEY` causing Prisma and email service failures
- **Solution**: Updated `cloudbuild.yaml` to use Google Cloud Secret Manager for sensitive environment variables

### 2. Next.js Dynamic Server Usage Errors

- **Problem**: API routes using `getServerSession` were causing static generation failures
- **Solution**:
  - Added `export const dynamic = 'force-dynamic'` to critical API routes
  - Updated `next.config.js` with `output: 'standalone'` and proper headers configuration

### 3. Docker Configuration

- **Problem**: Wrong startup script and missing error handling
- **Solution**: Updated Dockerfile to use `start-minimal.sh` with better error handling

### 4. Cloud Build Configuration

- **Problem**: Using source-based deployment which was causing build issues
- **Solution**: Updated to use proper Docker build, push, and deploy steps

## Deployment Steps

### Step 1: Set Up Secrets

Run the PowerShell script to set up your secrets:

```powershell
.\setup-secrets.ps1
```

This will prompt you for:

- `DATABASE_URL` - Your database connection string
- `RESEND_API_KEY` - Your Resend API key for email services
- `NEXTAUTH_SECRET` - Your NextAuth secret (will generate one if not provided)

### Step 2: Deploy to Cloud Run

Option A - Using Cloud Build (Recommended):

```bash
gcloud builds submit --config cloudbuild.yaml
```

Option B - Direct deployment:

```bash
gcloud run deploy freightfloo --source . --region europe-west1 --allow-unauthenticated
```

### Step 3: Verify Deployment

Check your deployment:

```bash
gcloud run services list --region europe-west1
```

## Key Changes Made

### 1. cloudbuild.yaml

- Changed from source-based to Docker-based deployment
- Added proper secret management
- Increased timeout and memory limits
- Added proper image tagging

### 2. next.config.js

- Added `output: 'standalone'` for better Cloud Run compatibility
- Added headers configuration for API routes
- Improved caching strategy

### 3. API Routes

- Added `export const dynamic = 'force-dynamic'` to routes using `getServerSession`
- This prevents static generation errors during build

### 4. Docker Configuration

- Updated to use `start-minimal.sh` with better error handling
- Added fallback DATABASE_URL for development
- Improved startup logging

### 5. Startup Scripts

- Enhanced `start-minimal.sh` with better error handling
- Added fallback for missing DATABASE_URL
- Non-blocking database setup

## Environment Variables Required

### Secrets (Managed by Google Cloud Secret Manager):

- `DATABASE_URL` - Database connection string
- `RESEND_API_KEY` - Resend email service API key
- `NEXTAUTH_SECRET` - NextAuth.js secret for JWT signing

### Environment Variables:

- `NODE_ENV=production`
- `PORT=8080`

## Troubleshooting

### If deployment still fails:

1. **Check secrets are properly set**:

   ```bash
   gcloud secrets list
   ```

2. **Verify Cloud Run service**:

   ```bash
   gcloud run services describe freightfloo --region europe-west1
   ```

3. **Check logs**:

   ```bash
   gcloud logs read --resource-type="cloud_run_revision" --filter="resource.labels.service_name=freightfloo" --limit=50
   ```

4. **Test locally with Docker**:
   ```bash
   docker build -t freightfloo-test .
   docker run -p 8080:8080 freightfloo-test
   ```

## Database Setup

The application will automatically create the database schema on first startup using Prisma. Make sure your `DATABASE_URL` points to a valid database (PostgreSQL recommended for production).

## Next Steps

1. Set up your database (PostgreSQL recommended)
2. Configure your domain and SSL certificates
3. Set up monitoring and alerting
4. Configure backup strategies

## Support

If you encounter issues:

1. Check the Cloud Run logs
2. Verify all secrets are properly configured
3. Test the application locally first
4. Ensure your database is accessible from Cloud Run
