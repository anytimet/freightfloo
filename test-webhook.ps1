# FreightFloo Webhook Test Script
# Run this to test if webhooks are working properly

Write-Host "🧪 Testing Stripe Webhook Integration..." -ForegroundColor Green

# Check if Stripe CLI is authenticated
Write-Host "`n1. Checking Stripe CLI authentication..." -ForegroundColor Yellow
stripe config --list 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Please complete Stripe CLI authentication first" -ForegroundColor Red
    Write-Host "Run: stripe login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Stripe CLI is authenticated" -ForegroundColor Green

# Test webhook events
Write-Host "`n2. Testing webhook events..." -ForegroundColor Yellow

Write-Host "`n📧 Triggering payment_intent.succeeded event..." -ForegroundColor Cyan
stripe trigger payment_intent.succeeded

Write-Host "`n❌ Triggering payment_intent.payment_failed event..." -ForegroundColor Cyan
stripe trigger payment_intent.payment_failed

Write-Host "`n⚖️ Triggering charge.dispute.created event..." -ForegroundColor Cyan
stripe trigger charge.dispute.created

Write-Host "`n✅ Webhook test events sent!" -ForegroundColor Green
Write-Host "`nCheck your application logs and database to verify the events were processed correctly." -ForegroundColor Yellow
Write-Host "`nExpected behavior:" -ForegroundColor Cyan
Write-Host "- Payment status should update to COMPLETED" -ForegroundColor White
Write-Host "- Shipment status should update to ASSIGNED" -ForegroundColor White
Write-Host "- Notifications should be created" -ForegroundColor White
Write-Host "- Email notifications should be sent" -ForegroundColor White
