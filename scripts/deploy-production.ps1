# FreightFloo Production Deployment Script (PowerShell)
# This script helps deploy the application to production

param(
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [string]$Region = "europe-west1"
)

Write-Host "🚀 FreightFloo Production Deployment Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if required tools are installed
function Test-Dependencies {
    Write-Host "Checking dependencies..."
    
    if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
        Write-Error "gcloud CLI is not installed. Please install it first."
        exit 1
    }
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed. Please install it first."
        exit 1
    }
    
    Write-Status "All dependencies are installed"
}

# Check environment variables
function Test-EnvironmentVariables {
    Write-Host "Checking environment variables..."
    
    $requiredVars = @(
        "NEXTAUTH_SECRET",
        "DATABASE_URL",
        "RESEND_API_KEY",
        "STRIPE_SECRET_KEY",
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "STRIPE_WEBHOOK_SECRET"
    )
    
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if (-not (Get-Item "env:$var" -ErrorAction SilentlyContinue)) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Error "Missing required environment variables:"
        foreach ($var in $missingVars) {
            Write-Host "  - $var" -ForegroundColor Red
        }
        exit 1
    }
    
    Write-Status "All required environment variables are set"
}

# Run tests and validation
function Invoke-Tests {
    if ($SkipTests) {
        Write-Warning "Skipping tests as requested"
        return
    }
    
    Write-Host "Running tests and validation..."
    
    # Check if tests pass
    try {
        npm run lint
        Write-Status "Linting passed"
    }
    catch {
        Write-Error "Linting failed. Please fix linting errors before deployment."
        exit 1
    }
    
    # Validate environment configuration
    try {
        node scripts/validate-environment.js
        Write-Status "Environment validation passed"
    }
    catch {
        Write-Error "Environment validation failed. Please fix configuration issues before deployment."
        exit 1
    }
    
    Write-Status "All tests and validation passed"
}

# Build application
function Build-Application {
    if ($SkipBuild) {
        Write-Warning "Skipping build as requested"
        return
    }
    
    Write-Host "Building application..."
    
    # Install dependencies
    npm install
    
    # Generate Prisma client
    npx prisma generate
    
    # Build the application
    npm run build
    
    Write-Status "Application built successfully"
}

# Deploy to Google Cloud Run
function Deploy-ToCloudRun {
    Write-Host "Deploying to Google Cloud Run..."
    
    # Deploy using Cloud Build
    gcloud builds submit --config cloudbuild.yaml
    
    Write-Status "Deployment to Cloud Run completed"
}

# Run database migrations
function Invoke-Migrations {
    Write-Host "Running database migrations..."
    
    # Note: This should be done after deployment
    Write-Warning "Remember to run database migrations after deployment:"
    Write-Host "  npx prisma db push" -ForegroundColor Yellow
}

# Verify deployment
function Test-Deployment {
    Write-Host "Verifying deployment..."
    
    # Get the service URL
    $serviceUrl = gcloud run services describe freightfloo-app --region=$Region --format="value(status.url)"
    
    if (-not $serviceUrl) {
        Write-Error "Could not get service URL"
        exit 1
    }
    
    Write-Host "Service URL: $serviceUrl"
    
    # Check health endpoint
    try {
        $healthResponse = Invoke-WebRequest -Uri "$serviceUrl/api/health" -UseBasicParsing
        if ($healthResponse.StatusCode -eq 200) {
            Write-Status "Health check passed"
        }
        else {
            Write-Error "Health check failed"
            exit 1
        }
    }
    catch {
        Write-Error "Health check failed: $($_.Exception.Message)"
        exit 1
    }
    
    # Check ready endpoint
    try {
        $readyResponse = Invoke-WebRequest -Uri "$serviceUrl/api/ready" -UseBasicParsing
        if ($readyResponse.StatusCode -eq 200) {
            Write-Status "Readiness check passed"
        }
        else {
            Write-Error "Readiness check failed"
            exit 1
        }
    }
    catch {
        Write-Error "Readiness check failed: $($_.Exception.Message)"
        exit 1
    }
}

# Main deployment function
function Start-Deployment {
    Write-Host "Starting deployment process..."
    
    Test-Dependencies
    Test-EnvironmentVariables
    Invoke-Tests
    Build-Application
    Deploy-ToCloudRun
    Invoke-Migrations
    Test-Deployment
    
    Write-Host ""
    Write-Status "🎉 Deployment completed successfully!"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Run database migrations: npx prisma db push"
    Write-Host "2. Test the application thoroughly"
    Write-Host "3. Set up monitoring and alerting"
    Write-Host "4. Configure custom domain (if needed)"
    Write-Host "5. Set up SSL certificate"
    Write-Host ""
    
    $serviceUrl = gcloud run services describe freightfloo-app --region=$Region --format="value(status.url)"
    Write-Host "Service URL: $serviceUrl"
}

# Run main function
Start-Deployment
