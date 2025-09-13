const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearSpecificPayment() {
  try {
    console.log('🧹 Clearing specific payment...')
    
    const paymentId = 'cmfha7x9d000bhxuj7r6fq9zc'
    const shipmentId = 'cmfh3b6620005cllad9atwdjd'
    
    // Delete the payment
    await prisma.payment.delete({
      where: { id: paymentId }
    })
    console.log(`✅ Deleted payment: ${paymentId}`)

    // Reset shipment status
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    })
    console.log(`✅ Reset shipment status: ${shipmentId}`)

    console.log('🎉 Payment cleared! You can now test payments again.')
    
  } catch (error) {
    console.error('❌ Error clearing payment:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearSpecificPayment()
