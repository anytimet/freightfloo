#!/bin/bash

# FreightFloo Production Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 FreightFloo Production Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    echo "Checking dependencies..."
    
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    print_status "All dependencies are installed"
}

# Check environment variables
check_env_vars() {
    echo "Checking environment variables..."
    
    required_vars=(
        "NEXTAUTH_SECRET"
        "DATABASE_URL"
        "RESEND_API_KEY"
        "STRIPE_SECRET_KEY"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "STRIPE_WEBHOOK_SECRET"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_status "All required environment variables are set"
}

# Run tests and validation
run_tests() {
    echo "Running tests and validation..."
    
    # Check if tests pass
    if ! npm run lint; then
        print_error "Linting failed. Please fix linting errors before deployment."
        exit 1
    fi
    
    # Validate environment configuration
    if ! node scripts/validate-environment.js; then
        print_error "Environment validation failed. Please fix configuration issues before deployment."
        exit 1
    fi
    
    print_status "All tests and validation passed"
}

# Build application
build_app() {
    echo "Building application..."
    
    # Install dependencies
    npm install
    
    # Generate Prisma client
    npx prisma generate
    
    # Build the application
    npm run build
    
    print_status "Application built successfully"
}

# Deploy to Google Cloud Run
deploy_to_cloud_run() {
    echo "Deploying to Google Cloud Run..."
    
    # Deploy using Cloud Build
    gcloud builds submit --config cloudbuild.yaml
    
    print_status "Deployment to Cloud Run completed"
}

# Run database migrations
run_migrations() {
    echo "Running database migrations..."
    
    # Note: This should be done after deployment
    print_warning "Remember to run database migrations after deployment:"
    echo "  npx prisma db push"
}

# Verify deployment
verify_deployment() {
    echo "Verifying deployment..."
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe freightfloo-app --region=europe-west1 --format="value(status.url)")
    
    if [ -z "$SERVICE_URL" ]; then
        print_error "Could not get service URL"
        exit 1
    fi
    
    echo "Service URL: $SERVICE_URL"
    
    # Check health endpoint
    if curl -f "$SERVICE_URL/api/health" > /dev/null 2>&1; then
        print_status "Health check passed"
    else
        print_error "Health check failed"
        exit 1
    fi
    
    # Check ready endpoint
    if curl -f "$SERVICE_URL/api/ready" > /dev/null 2>&1; then
        print_status "Readiness check passed"
    else
        print_error "Readiness check failed"
        exit 1
    fi
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    
    check_dependencies
    check_env_vars
    run_tests
    build_app
    deploy_to_cloud_run
    run_migrations
    verify_deployment
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run database migrations: npx prisma db push"
    echo "2. Test the application thoroughly"
    echo "3. Set up monitoring and alerting"
    echo "4. Configure custom domain (if needed)"
    echo "5. Set up SSL certificate"
    echo ""
    echo "Service URL: $(gcloud run services describe freightfloo-app --region=europe-west1 --format="value(status.url)")"
}

# Run main function
main "$@"
