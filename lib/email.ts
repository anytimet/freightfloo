import { Resend } from 'resend'

// Initialize Resend only when API key is available
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export interface EmailNotification {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailNotification) {
  try {
    const resend = getResendClient()
    if (!resend) {
      console.log('Email not sent - RESEND_API_KEY not configured')
      return { success: false, error: 'Email service not configured' }
    }

    const { data, error } = await resend.emails.send({
      from: 'FreightFloo <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Email sending error:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export function createEmailTemplate(type: string, data: any): { subject: string; html: string } {
  switch (type) {
    case 'NEW_BID':
      return {
        subject: `New Bid Received - ${data.shipmentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Bid Received!</h2>
            <p>A carrier has placed a new bid on your shipment:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">${data.shipmentTitle}</h3>
              <p style="margin: 5px 0;"><strong>Bid Amount:</strong> $${data.bidAmount}</p>
              <p style="margin: 5px 0;"><strong>Carrier:</strong> ${data.carrierName}</p>
              ${data.bidMessage ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${data.bidMessage}</p>` : ''}
            </div>
            <p><a href="${data.shipmentUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Shipment</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'BID_ACCEPTED':
      return {
        subject: `Bid Accepted - ${data.shipmentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Congratulations! Your Bid Was Accepted</h2>
            <p>Great news! The shipper has accepted your bid:</p>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="margin: 0 0 10px 0;">${data.shipmentTitle}</h3>
              <p style="margin: 5px 0;"><strong>Accepted Bid:</strong> $${data.bidAmount}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> Waiting for Payment</p>
            </div>
            <p>Please wait for the shipper to complete payment. You will be notified once the shipment is officially assigned to you.</p>
            <p><a href="${data.shipmentUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Shipment</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'BID_REJECTED':
      return {
        subject: `Bid Update - ${data.shipmentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Bid Update</h2>
            <p>Your bid for the following shipment was not selected:</p>
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin: 0 0 10px 0;">${data.shipmentTitle}</h3>
              <p style="margin: 5px 0;"><strong>Your Bid:</strong> $${data.bidAmount}</p>
            </div>
            <p>Don't worry! You can place a new bid with a lower amount to stay competitive.</p>
            <p><a href="${data.shipmentUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Place New Bid</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'PAYMENT_COMPLETED':
      return {
        subject: `Payment Completed - ${data.shipmentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Payment Completed Successfully</h2>
            <p>Payment has been processed for your shipment:</p>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="margin: 0 0 10px 0;">${data.shipmentTitle}</h3>
              <p style="margin: 5px 0;"><strong>Amount:</strong> $${data.bidAmount}</p>
              <p style="margin: 5px 0;"><strong>Carrier:</strong> ${data.carrierName}</p>
            </div>
            <p>The carrier has been notified and will contact you soon to arrange pickup.</p>
            <p><a href="${data.shipmentUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Shipment</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'SHIPMENT_ASSIGNED':
      return {
        subject: `Shipment Assigned - ${data.shipmentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">🎉 Shipment Assigned to You!</h2>
            <p>Excellent news! Payment has been completed and the shipment is now officially yours:</p>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="margin: 0 0 10px 0;">${data.shipmentTitle}</h3>
              <p style="margin: 5px 0;"><strong>Your Bid:</strong> $${data.bidAmount}</p>
              <p style="margin: 5px 0;"><strong>Origin:</strong> ${data.origin}</p>
              <p style="margin: 5px 0;"><strong>Destination:</strong> ${data.destination}</p>
              <p style="margin: 5px 0;"><strong>Pickup Date:</strong> ${data.pickupDate}</p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Contact the shipper to arrange pickup details</li>
              <li>Confirm pickup time and location</li>
              <li>Update shipment status as you progress</li>
            </ul>
            <p><a href="${data.shipmentUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Shipment Details</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'EMAIL_VERIFICATION':
      return {
        subject: 'Verify Your FreightFloo Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Welcome to FreightFloo!</h2>
            <p>Hi ${data.name},</p>
            <p>Thank you for signing up! To complete your account setup, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verificationUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${data.verificationUrl}</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This verification link will expire in 24 hours.</p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'PASSWORD_RESET':
      return {
        subject: 'Reset Your FreightFloo Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Password Reset Request</h2>
            <p>Hi ${data.name},</p>
            <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetUrl}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${data.resetUrl}</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This reset link will expire in 1 hour.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'OFFER_ACCEPTED':
      return {
        subject: `Offer Accepted - ${data.shipmentTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">🎉 Your Offer Has Been Accepted!</h2>
            <p>Great news! A carrier has accepted your offer:</p>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="margin: 0 0 10px 0;">${data.shipmentTitle}</h3>
              <p style="margin: 5px 0;"><strong>Accepted Offer:</strong> $${data.bidAmount}</p>
              <p style="margin: 5px 0;"><strong>Carrier:</strong> ${data.carrierName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> Waiting for Payment</p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Complete payment to officially assign the shipment</li>
              <li>The carrier will be notified once payment is processed</li>
              <li>You can track the shipment progress in your dashboard</li>
            </ul>
            <p><a href="${data.shipmentUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Payment</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'CONTACT_FORM':
      return {
        subject: `New Contact Form Submission: ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">📧 New Contact Form Submission</h2>
            <p>You have received a new message through the FreightFloo contact form:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 5px 0;"><strong>Inquiry Type:</strong> ${data.inquiryType}</p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
              <p style="margin: 5px 0;"><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    case 'CONTACT_CONFIRMATION':
      return {
        subject: 'Thank you for contacting FreightFloo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank You for Contacting FreightFloo!</h2>
            <p>Hi ${data.name},</p>
            <p>Thank you for reaching out to us. We have received your message regarding "${data.subject}" and will get back to you within 24 hours.</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin: 0 0 10px 0;">What happens next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Our team will review your inquiry</li>
                <li>We'll respond within 24 hours</li>
                <li>If urgent, please call us at +1 (555) 123-4567</li>
              </ul>
            </div>
            <p>In the meantime, feel free to explore our marketplace and see how FreightFloo can help with your shipping needs.</p>
            <p><a href="https://freightfloo.com" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Visit FreightFloo</a></p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }

    default:
      return {
        subject: 'FreightFloo Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>FreightFloo Notification</h2>
            <p>${data.message || 'You have a new notification from FreightFloo.'}</p>
            <p style="color: #6b7280; font-size: 14px;">FreightFloo - Connecting Shippers with Trusted Carriers</p>
          </div>
        `
      }
  }
}
