const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearTestPayments() {
  try {
    console.log('🧹 Clearing test payment data...')
    
    // Find and delete test payments
    const testPayments = await prisma.payment.findMany({
      where: {
        OR: [
          { description: { contains: 'test' } },
          { description: { contains: 'Test' } },
          { amount: { lte: 100 } }, // Small amounts likely to be tests
        ]
      },
      include: {
        shipment: true
      }
    })

    console.log(`Found ${testPayments.length} test payments to clear`)

    for (const payment of testPayments) {
      console.log(`Deleting payment: ${payment.id} - $${payment.amount}`)
      
      // Delete the payment
      await prisma.payment.delete({
        where: { id: payment.id }
      })

      // Reset shipment status if it was assigned due to this payment
      if (payment.shipment.status === 'ASSIGNED' && payment.shipment.paymentStatus === 'COMPLETED') {
        await prisma.shipment.update({
          where: { id: payment.shipment.id },
          data: {
            status: 'PENDING',
            paymentStatus: 'PENDING'
          }
        })
        console.log(`Reset shipment ${payment.shipment.id} status to PENDING`)
      }
    }

    console.log('✅ Test payment data cleared successfully!')
    console.log('You can now test payments again.')
    
  } catch (error) {
    console.error('❌ Error clearing test payments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearTestPayments()
