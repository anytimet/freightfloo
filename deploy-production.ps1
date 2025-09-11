# FreightFloo Production Deployment Script
# This script deploys the application to Google Cloud Run

Write-Host "=== FreightFloo Production Deployment ===" -ForegroundColor Green
Write-Host ""

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version --format="value(Google Cloud SDK)" 2>$null
    Write-Host "✅ Google Cloud SDK found: $gcloudVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Google Cloud SDK not found. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if user is authenticated
try {
    $authInfo = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    if ($authInfo) {
        Write-Host "✅ Authenticated as: $authInfo" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Not authenticated. Please run: gcloud auth login" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Authentication check failed. Please run: gcloud auth login" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Set project (you may need to change this)
$projectId = Read-Host "Enter your Google Cloud Project ID"
if (-not $projectId) {
    Write-Host "❌ Project ID is required" -ForegroundColor Red
    exit 1
}

Write-Host "Setting project to: $projectId" -ForegroundColor Yellow
gcloud config set project $projectId

Write-Host ""

# Check if required APIs are enabled
Write-Host "Checking required APIs..." -ForegroundColor Yellow
$apis = @("run.googleapis.com", "cloudbuild.googleapis.com", "secretmanager.googleapis.com")
foreach ($api in $apis) {
    $status = gcloud services list --enabled --filter="name:$api" --format="value(name)" 2>$null
    if ($status) {
        Write-Host "✅ $api is enabled" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  $api is not enabled. Enabling..." -ForegroundColor Yellow
        gcloud services enable $api
    }
}

Write-Host ""

# Check if secrets exist
Write-Host "Checking required secrets..." -ForegroundColor Yellow
$secrets = @("NEXTAUTH_SECRET", "DATABASE_URL", "RESEND_API_KEY")
$missingSecrets = @()

foreach ($secret in $secrets) {
    $exists = gcloud secrets describe $secret --format="value(name)" 2>$null
    if ($exists) {
        Write-Host "✅ Secret $secret exists" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Secret $secret is missing" -ForegroundColor Red
        $missingSecrets += $secret
    }
}

if ($missingSecrets.Count -gt 0) {
    Write-Host ""
    Write-Host "Missing secrets detected. Please create them first:" -ForegroundColor Red
    foreach ($secret in $missingSecrets) {
        Write-Host "  gcloud secrets create $secret --data-file=-" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "See PRODUCTION_SETUP.md for detailed instructions." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Build and deploy
Write-Host "Building and deploying to Cloud Run..." -ForegroundColor Yellow
try {
    gcloud builds submit --config cloudbuild.yaml
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Deployment failed. Check the logs above for details." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run database migrations: npx prisma db push" -ForegroundColor White
Write-Host "2. Test your application at the provided URL" -ForegroundColor White
Write-Host "3. Check the health endpoint: /api/health-check" -ForegroundColor White
Write-Host "4. Test authentication and forgot password functionality" -ForegroundColor White
Write-Host ""
Write-Host "For troubleshooting, see PRODUCTION_SETUP.md" -ForegroundColor Yellow
