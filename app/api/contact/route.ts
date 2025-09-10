import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, createEmailTemplate } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, inquiryType } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Send email notification to admin
    const adminEmail = 'admin@freightfloo.com' // You can change this to your email
    
    const emailTemplate = createEmailTemplate('CONTACT_FORM', {
      name,
      email,
      subject,
      message,
      inquiryType
    })

    await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: emailTemplate.html
    })

    // Send confirmation email to user
    const userEmailTemplate = createEmailTemplate('CONTACT_CONFIRMATION', {
      name,
      subject
    })

    await sendEmail({
      to: email,
      subject: 'Thank you for contacting FreightFloo',
      html: userEmailTemplate.html
    })

    return NextResponse.json({
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
