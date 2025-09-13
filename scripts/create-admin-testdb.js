const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use test.db database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db'
    }
  }
})

async function createAdminInTestDb() {
  try {
    // Delete any existing admin first
    await prisma.user.deleteMany({
      where: { role: 'ADMIN' }
    })
    
    // Create new admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@freightfloo.com',
        password: hashedPassword,
        role: 'ADMIN',
        userType: 'INDIVIDUAL',
        emailVerified: true
      }
    })
    
    console.log('✅ Admin created in test.db:', admin.email)
    
    // List all users in test.db
    const users = await prisma.user.findMany({
      select: { email: true, role: true, createdAt: true }
    })
    console.log('Users in test.db:', users)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminInTestDb()
