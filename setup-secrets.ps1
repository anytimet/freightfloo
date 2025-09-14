# FreightFloo Cloud Run Secrets Setup Script
# Run this script to set up the required secrets in Google Cloud Secret Manager

Write-Host "🔐 Setting up FreightFloo secrets in Google Cloud Secret Manager..." -ForegroundColor Green

# Set your project ID
$PROJECT_ID = "freightfloo-v4"

Write-Host "📝 Please provide the following values:" -ForegroundColor Yellow

# Get DATABASE_URL
$DATABASE_URL = Read-Host "Enter your DATABASE_URL (e.g., postgresql://user:password@host:port/database)"

# Get RESEND_API_KEY
$RESEND_API_KEY = Read-Host "Enter your RESEND_API_KEY"

# Get NEXTAUTH_SECRET
$NEXTAUTH_SECRET = Read-Host "Enter your NEXTAUTH_SECRET (or press Enter to generate one)"

# Generate NEXTAUTH_SECRET if not provided
if ([string]::IsNullOrEmpty($NEXTAUTH_SECRET)) {
    # Generate a random base64 string
    $bytes = New-Object Byte[] 32
    $rand = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rand.GetBytes($bytes)
    $NEXTAUTH_SECRET = [Convert]::ToBase64String($bytes)
    Write-Host "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET" -ForegroundColor Cyan
}

Write-Host "🚀 Creating secrets..." -ForegroundColor Blue

# Create DATABASE_URL secret
try {
    gcloud secrets create DATABASE_URL --data-file=- --project=$PROJECT_ID 2>$null
} catch {
    gcloud secrets versions add DATABASE_URL --data-file=- --project=$PROJECT_ID
}
$DATABASE_URL | gcloud secrets create DATABASE_URL --data-file=- --project=$PROJECT_ID 2>$null
if ($LASTEXITCODE -ne 0) {
    $DATABASE_URL | gcloud secrets versions add DATABASE_URL --data-file=- --project=$PROJECT_ID
}

# Create RESEND_API_KEY secret
try {
    $RESEND_API_KEY | gcloud secrets create RESEND_API_KEY --data-file=- --project=$PROJECT_ID 2>$null
} catch {
    $RESEND_API_KEY | gcloud secrets versions add RESEND_API_KEY --data-file=- --project=$PROJECT_ID
}
if ($LASTEXITCODE -ne 0) {
    $RESEND_API_KEY | gcloud secrets versions add RESEND_API_KEY --data-file=- --project=$PROJECT_ID
}

# Create NEXTAUTH_SECRET secret
try {
    $NEXTAUTH_SECRET | gcloud secrets create NEXTAUTH_SECRET --data-file=- --project=$PROJECT_ID 2>$null
} catch {
    $NEXTAUTH_SECRET | gcloud secrets versions add NEXTAUTH_SECRET --data-file=- --project=$PROJECT_ID
}
if ($LASTEXITCODE -ne 0) {
    $NEXTAUTH_SECRET | gcloud secrets versions add NEXTAUTH_SECRET --data-file=- --project=$PROJECT_ID
}

Write-Host "✅ Secrets created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: gcloud builds submit --config cloudbuild.yaml"
Write-Host "2. Or deploy directly: gcloud run deploy freightfloo --source . --region europe-west1"
Write-Host ""
Write-Host "📋 Your secrets:" -ForegroundColor Cyan
Write-Host "DATABASE_URL: [HIDDEN]"
Write-Host "RESEND_API_KEY: [HIDDEN]"
Write-Host "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
