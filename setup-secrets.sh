#!/bin/bash

# FreightFloo Cloud Run Secrets Setup Script
# Run this script to set up the required secrets in Google Cloud Secret Manager

echo "🔐 Setting up FreightFloo secrets in Google Cloud Secret Manager..."

# Set your project ID
PROJECT_ID="freightfloo-v4"

echo "📝 Please provide the following values:"

# Get DATABASE_URL
echo -n "Enter your DATABASE_URL (e.g., postgresql://user:password@host:port/database): "
read DATABASE_URL

# Get RESEND_API_KEY
echo -n "Enter your RESEND_API_KEY: "
read RESEND_API_KEY

# Get NEXTAUTH_SECRET
echo -n "Enter your NEXTAUTH_SECRET (or press Enter to generate one): "
read NEXTAUTH_SECRET

# Generate NEXTAUTH_SECRET if not provided
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
fi

echo "🚀 Creating secrets..."

# Create DATABASE_URL secret
gcloud secrets create DATABASE_URL --data-file=- <<< "$DATABASE_URL" --project="$PROJECT_ID" 2>/dev/null || \
gcloud secrets versions add DATABASE_URL --data-file=- <<< "$DATABASE_URL" --project="$PROJECT_ID"

# Create RESEND_API_KEY secret
gcloud secrets create RESEND_API_KEY --data-file=- <<< "$RESEND_API_KEY" --project="$PROJECT_ID" 2>/dev/null || \
gcloud secrets versions add RESEND_API_KEY --data-file=- <<< "$RESEND_API_KEY" --project="$PROJECT_ID"

# Create NEXTAUTH_SECRET secret
gcloud secrets create NEXTAUTH_SECRET --data-file=- <<< "$NEXTAUTH_SECRET" --project="$PROJECT_ID" 2>/dev/null || \
gcloud secrets versions add NEXTAUTH_SECRET --data-file=- <<< "$NEXTAUTH_SECRET" --project="$PROJECT_ID"

echo "✅ Secrets created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Run: gcloud builds submit --config cloudbuild.yaml"
echo "2. Or deploy directly: gcloud run deploy freightfloo --source . --region europe-west1"
echo ""
echo "📋 Your secrets:"
echo "DATABASE_URL: [HIDDEN]"
echo "RESEND_API_KEY: [HIDDEN]"
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
