# Test Authentication System
# Run this script to test login and forgot password functionality

Write-Host "=== FreightFloo Authentication Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Check if server is running
Write-Host "1. Testing server connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running on http://localhost:3000" -ForegroundColor Green
}
catch {
    Write-Host "❌ Server is not running. Please start it with: npm run dev" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Test forgot password endpoint
Write-Host "2. Testing forgot password endpoint..." -ForegroundColor Yellow
$testEmail = "test@example.com"
$body = @{
    email = $testEmail
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/forgot-password" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Forgot password endpoint is working" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Forgot password endpoint failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Test with invalid email
Write-Host "3. Testing forgot password with invalid email..." -ForegroundColor Yellow
$invalidEmail = "nonexistent@example.com"
$body = @{
    email = $invalidEmail
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/forgot-password" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Invalid email handled correctly" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Invalid email test failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Check the server console for detailed logs" -ForegroundColor White
Write-Host "2. Try logging in with valid credentials" -ForegroundColor White
Write-Host "3. Try the forgot password flow" -ForegroundColor White
Write-Host "4. If email service is not configured, check console for reset URLs" -ForegroundColor White
