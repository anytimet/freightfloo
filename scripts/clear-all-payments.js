const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearAllPayments() {
  try {
    console.log('🧹 Clearing ALL payments for furniture shipment...')
    
    const shipmentId = 'cmfh3b6620005cllad9atwdjd'
    
    // Find all payments for this shipment
    const payments = await prisma.payment.findMany({
      where: { shipmentId: shipmentId }
    })
    
    console.log(`Found ${payments.length} payments to delete:`)
    
    // Delete all payments for this shipment
    for (const payment of payments) {
      await prisma.payment.delete({
        where: { id: payment.id }
      })
      console.log(`✅ Deleted payment: ${payment.id} - $${payment.amount}`)
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

    console.log('🎉 ALL payments cleared! The shipment is now clean.')
    
  } catch (error) {
    console.error('❌ Error clearing payments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearAllPayments()
