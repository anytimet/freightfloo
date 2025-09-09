# FreightFloo Webhook Setup Script
# Run this after completing Stripe CLI authentication

Write-Host "🔗 Setting up Stripe Webhook Integration..." -ForegroundColor Green

# Check if Stripe CLI is authenticated
Write-Host "`n1. Checking Stripe CLI authentication..." -ForegroundColor Yellow
stripe config --list 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Stripe CLI is authenticated" -ForegroundColor Green
}
else {
    Write-Host "❌ Please complete Stripe CLI authentication first" -ForegroundColor Red
    Write-Host "Run: stripe login" -ForegroundColor Yellow
    exit 1
}

# Start webhook forwarding
Write-Host "`n2. Starting webhook forwarding to local server..." -ForegroundColor Yellow
Write-Host "This will forward Stripe webhooks to: http://localhost:3000/api/payments/webhook" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the webhook forwarding when you're done testing." -ForegroundColor Yellow
Write-Host "`nStarting webhook listener..." -ForegroundColor Green

# Start the webhook listener
stripe listen --forward-to localhost:3000/api/payments/webhook
