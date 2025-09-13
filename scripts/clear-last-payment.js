const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearLastPayment() {
  try {
    console.log('🧹 Clearing the last payment record...')
    
    const paymentId = 'cmfhb5j630001igewz2h27w63'
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

clearLastPayment()
