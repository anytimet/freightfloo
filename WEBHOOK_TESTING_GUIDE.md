# 🧪 Webhook Testing Guide

## ✅ Your Webhook is Now Configured!

Your Stripe webhook is set up and ready to receive events. Here's how to test and verify it's working:

## 🔧 Current Setup

- **Webhook Secret**: `whsec_a2dba77571e13446332edf9eadddab4015ff7ec511fdce6fa0706f1dbbe55798`
- **Local Endpoint**: `http://localhost:3000/api/payments/webhook`
- **Status**: ✅ Active and forwarding events

## 🧪 Testing Commands

### Test Successful Payment

```bash
stripe trigger payment_intent.succeeded
```

### Test Failed Payment

```bash
stripe trigger payment_intent.payment_failed
```

### Test Dispute Creation

```bash
stripe trigger charge.dispute.created
```

### Test Dispute Update

```bash
stripe trigger charge.dispute.updated
```

## 📊 Monitoring Webhook Events

### 1. Stripe CLI Logs

Your webhook forwarding is active. You should see events in your terminal where you ran:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

### 2. Application Logs

Check your Next.js development server logs for webhook processing messages.

### 3. Database Verification

After triggering events, check your database to see if:

- Payment records are created/updated
- Notifications are generated
- Shipment statuses are updated

## 🔍 Troubleshooting

### If Webhook Events Aren't Being Received:

1. **Check if your dev server is running**:

   ```bash
   pnpm dev
   ```

2. **Verify webhook forwarding is active**:

   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

3. **Check your .env.local file**:
   Make sure `STRIPE_WEBHOOK_SECRET` is set correctly.

4. **Test webhook endpoint directly**:
   ```bash
   curl -X POST http://localhost:3000/api/payments/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

### If Events Are Received But Not Processed:

1. **Check application logs** for error messages
2. **Verify database connection** is working
3. **Check if required environment variables** are set
4. **Ensure webhook secret matches** in your environment

## 🎯 Expected Behavior

When you trigger test events, you should see:

### payment_intent.succeeded

- Payment status updated to "COMPLETED"
- Shipment status updated to "ASSIGNED"
- Notifications created for shipper and carrier
- Email notifications sent (if configured)

### payment_intent.payment_failed

- Payment status updated to "FAILED"
- Notification created for failed payment
- Error handling triggered

## 🚀 Next Steps

1. **Add your Stripe API keys** to `.env.local`
2. **Test with real payment flow** in your application
3. **Verify email notifications** are working
4. **Check database updates** after payments
5. **Test refund functionality**

## 📝 Environment Variables Checklist

Make sure these are in your `.env.local`:

```env
# ✅ Webhook Secret (You have this!)
STRIPE_WEBHOOK_SECRET=whsec_a2dba77571e13446332edf9eadddab4015ff7ec511fdce6fa0706f1dbbe55798

# ⚠️ Still need to add:
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## 🎉 You're Ready!

Your webhook is configured and ready to handle payment events. The next step is to add your Stripe API keys and test the complete payment flow in your application!
