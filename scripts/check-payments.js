const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPayments() {
  try {
    console.log('🔍 Checking existing payments...')
    
    const payments = await prisma.payment.findMany({
      include: {
        shipment: {
          select: {
            id: true,
            title: true,
            status: true,
            paymentStatus: true
          }
        },
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${payments.length} payments:`)
    console.log('=' .repeat(80))
    
    payments.forEach((payment, index) => {
      console.log(`${index + 1}. Payment ID: ${payment.id}`)
      console.log(`   Amount: $${payment.amount}`)
      console.log(`   Status: ${payment.status}`)
      console.log(`   Shipment: ${payment.shipment.title} (${payment.shipment.id})`)
      console.log(`   Shipment Status: ${payment.shipment.status}`)
      console.log(`   Payment Status: ${payment.shipment.paymentStatus}`)
      console.log(`   User: ${payment.user.email}`)
      console.log(`   Created: ${payment.createdAt}`)
      console.log('-' .repeat(40))
    })
    
  } catch (error) {
    console.error('❌ Error checking payments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPayments()
