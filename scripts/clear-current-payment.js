const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearCurrentPayment() {
  try {
    console.log('🧹 Clearing the current payment record...')
    
    const paymentId = 'cmfhbzyyn00011wq8pfxbfuqf'
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

    console.log('🎉 Payment cleared! Database is now clean.')
    
  } catch (error) {
    console.error('❌ Error clearing payment:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearCurrentPayment()
