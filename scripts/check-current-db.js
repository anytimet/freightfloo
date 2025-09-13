const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    // Try to find the admin user
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (admin) {
      console.log('✅ Admin found in current database:', admin.email)
    } else {
      console.log('❌ Admin not found in current database')
      
      // List all users to see what's in the database
      const users = await prisma.user.findMany({
        select: { email: true, role: true }
      })
      console.log('Users in current database:', users)
    }
  } catch (error) {
    console.error('Database error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
