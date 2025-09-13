const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearDuplicatePayments() {
  try {
    console.log('🧹 Clearing duplicate payments...')
    
    const paymentIds = [
      'cmfhadhpw000fhxujxk66ymbf',
      'cmfhadhpx000hhxujl6m25usc'
    ]
    const shipmentId = 'cmfh3b6620005cllad9atwdjd'
    
    // Delete both duplicate payments
    for (const paymentId of paymentIds) {
      await prisma.payment.delete({
        where: { id: paymentId }
      })
      console.log(`✅ Deleted payment: ${paymentId}`)
    }

    // Reset shipment status
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    })
    console.log(`✅ Reset shipment status: ${shipmentId}`)

    console.log('🎉 All duplicate payments cleared! You can now test payments again.')
    
  } catch (error) {
    console.error('❌ Error clearing payments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDuplicatePayments()
