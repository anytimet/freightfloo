import { prisma } from '@/lib/prisma'

export interface PaymentSecurityCheck {
  isValid: boolean
  reason?: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}

/**
 * Comprehensive payment security checks
 */
export async function validatePaymentSecurity(
  userId: string,
  amount: number,
  shipmentId: string
): Promise<PaymentSecurityCheck> {
  try {
    // Check 1: User account age and verification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        emailVerified: true,
        carrierVerified: true,
        role: true
      }
    })

    if (!user) {
      return {
        isValid: false,
        reason: 'User not found',
        riskLevel: 'HIGH'
      }
    }

    // Check 2: Account age (minimum 24 hours in production, 1 minute in development)
    const accountAge = Date.now() - new Date(user.createdAt).getTime()
    const isDevelopment = process.env.NODE_ENV === 'development'
    const minAccountAge = isDevelopment ? 60 * 1000 : 24 * 60 * 60 * 1000 // 1 minute in dev, 24 hours in prod

    if (accountAge < minAccountAge) {
      return {
        isValid: false,
        reason: isDevelopment 
          ? 'Account too new for payments (wait 1 minute)' 
          : 'Account too new for large payments',
        riskLevel: 'HIGH'
      }
    }

    // Check 3: Email verification (skip in development)
    if (!user.emailVerified && !isDevelopment) {
      return {
        isValid: false,
        reason: 'Email not verified',
        riskLevel: 'MEDIUM'
      }
    }

    // Check 4: Payment amount limits
    const maxPaymentAmount = 10000 // $10,000 limit
    if (amount > maxPaymentAmount) {
      return {
        isValid: false,
        reason: 'Payment amount exceeds limit',
        riskLevel: 'HIGH'
      }
    }

    // Check 5: Recent payment history
    const recentPayments = await prisma.payment.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: { amount: true, status: true }
    })

    const totalRecentPayments = recentPayments
      .filter((p: any) => p.status === 'COMPLETED')
      .reduce((sum: number, p: any) => sum + p.amount, 0)

    const dailyLimit = 5000 // $5,000 daily limit
    if (totalRecentPayments + amount > dailyLimit) {
      return {
        isValid: false,
        reason: 'Daily payment limit exceeded',
        riskLevel: 'HIGH'
      }
    }

    // Check 6: Duplicate payment detection
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        shipmentId,
        status: { in: ['PENDING', 'COMPLETED'] }
      }
    })

    if (existingPayment) {
      return {
        isValid: false,
        reason: 'Payment already exists for this shipment',
        riskLevel: 'MEDIUM'
      }
    }

    // Check 7: Suspicious activity detection
    const failedPayments = await prisma.payment.findMany({
      where: {
        userId,
        status: 'FAILED',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    })

    if (failedPayments.length >= 3) {
      return {
        isValid: false,
        reason: 'Too many failed payment attempts',
        riskLevel: 'HIGH'
      }
    }

    // Determine risk level based on checks
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

    if (accountAge < 7 * 24 * 60 * 60 * 1000) { // Less than 7 days
      riskLevel = 'MEDIUM'
    }

    if (amount > 1000) { // Over $1,000
      riskLevel = 'MEDIUM'
    }

    if (amount > 5000) { // Over $5,000
      riskLevel = 'HIGH'
    }

    return {
      isValid: true,
      riskLevel
    }

  } catch (error) {
    console.error('Payment security check error:', error)
    return {
      isValid: false,
      reason: 'Security check failed',
      riskLevel: 'HIGH'
    }
  }
}

/**
 * Log suspicious payment activity
 */
export async function logSuspiciousActivity(
  userId: string,
  activity: string,
  details: any
) {
  try {
    await prisma.notification.create({
      data: {
        type: 'SECURITY_ALERT',
        title: 'Suspicious Payment Activity',
        message: `Security alert: ${activity}`,
        userId,
      }
    })
  } catch (error) {
    console.error('Failed to log suspicious activity:', error)
  }
}

/**
 * Rate limiting for payment attempts
 */
const paymentAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userAttempts = paymentAttempts.get(userId)

  if (!userAttempts) {
    paymentAttempts.set(userId, { count: 1, lastAttempt: now })
    return true
  }

  // Reset counter if last attempt was more than 1 hour ago
  if (now - userAttempts.lastAttempt > 60 * 60 * 1000) {
    paymentAttempts.set(userId, { count: 1, lastAttempt: now })
    return true
  }

  // Allow maximum 5 attempts per hour
  if (userAttempts.count >= 5) {
    return false
  }

  userAttempts.count++
  userAttempts.lastAttempt = now
  return true
}
