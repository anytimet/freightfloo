# 🔗 Stripe Webhook Setup Guide

This guide will help you set up Stripe webhooks for your FreightFloo application to handle real-time payment events.

## 📋 Prerequisites

- Stripe account with API keys configured
- FreightFloo application running
- Public URL for webhook endpoint (for production)

## 🚀 Step-by-Step Setup

### 1. **Configure Environment Variables**

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

### 2. **Get Your Webhook Secret**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Set the endpoint URL to: `https://yourdomain.com/api/payments/webhook`
5. Select these events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.dispute.created`
   - `charge.dispute.updated`
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 3. **For Development (Local Testing)**

Since webhooks require a public URL, you'll need to use a tunneling service:

#### Option A: Using Stripe CLI (Recommended)

1. **Install Stripe CLI:**

   ```bash
   # Windows (using Chocolatey)
   choco install stripe-cli

   # macOS (using Homebrew)
   brew install stripe/stripe-cli/stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
   tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. **Login to Stripe:**

   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server:**

   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

4. **Copy the webhook secret** from the CLI output and add it to `.env.local`

#### Option B: Using ngrok

1. **Install ngrok:**

   - Download from [ngrok.com](https://ngrok.com)
   - Or use package manager: `npm install -g ngrok`

2. **Start your Next.js app:**

   ```bash
   pnpm dev
   ```

3. **In another terminal, expose your local server:**

   ```bash
   ngrok http 3000
   ```

4. **Use the ngrok URL** in your Stripe webhook endpoint:
   ```
   https://abc123.ngrok.io/api/payments/webhook
   ```

### 4. **Test Your Webhook**

1. **Test with Stripe CLI:**

   ```bash
   stripe trigger payment_intent.succeeded
   ```

2. **Or test manually:**
   - Make a test payment in your app
   - Check your server logs for webhook events
   - Verify the payment status updates correctly

### 5. **Production Setup**

1. **Deploy your application** to a hosting service (Vercel, Netlify, etc.)

2. **Update webhook endpoint** in Stripe Dashboard:

   ```
   https://yourdomain.com/api/payments/webhook
   ```

3. **Update environment variables** in your hosting platform

4. **Test with real payments** (use small amounts)

## 🔧 Webhook Events Handled

Your application currently handles these Stripe events:

### `payment_intent.succeeded`

- Updates payment status to `COMPLETED`
- Updates shipment status to `ASSIGNED`
- Sends notifications to shipper and carrier
- Sends email confirmations

### `payment_intent.payment_failed`

- Updates payment status to `FAILED`
- Creates notification for failed payment

### `charge.dispute.created`

- Handles payment disputes
- Creates dispute notifications

### `charge.dispute.updated`

- Updates dispute status
- Sends dispute resolution notifications

## 🛠️ Troubleshooting

### Common Issues:

1. **Webhook not receiving events:**

   - Check webhook URL is correct
   - Verify webhook secret matches
   - Ensure your server is accessible

2. **Signature verification failed:**

   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure raw request body is used for verification

3. **Events not processing:**
   - Check server logs for errors
   - Verify database connections
   - Test with Stripe CLI

### Debug Commands:

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/payments/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed

# View webhook logs
stripe logs tail
```

## 📊 Monitoring

### Stripe Dashboard:

- Go to **Developers** → **Webhooks**
- Click on your webhook endpoint
- View **Recent deliveries** to see event history
- Check **Response** for any errors

### Application Logs:

- Monitor your server logs for webhook processing
- Check for any database errors
- Verify email sending is working

## 🔒 Security Best Practices

1. **Always verify webhook signatures**
2. **Use HTTPS in production**
3. **Keep webhook secrets secure**
4. **Implement idempotency** for webhook handlers
5. **Log all webhook events** for debugging
6. **Set up monitoring** for failed webhooks

## 📝 Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Security Best Practices](https://stripe.com/docs/webhooks/signatures)

## 🆘 Support

If you encounter issues:

1. Check Stripe Dashboard webhook logs
2. Review your application logs
3. Test with Stripe CLI
4. Verify environment variables
5. Check database connectivity

---

**Note:** This guide assumes you're using the FreightFloo application structure. Adjust paths and configurations as needed for your specific setup.
