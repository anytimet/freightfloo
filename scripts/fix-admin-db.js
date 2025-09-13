const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Use the exact same database URL as the server
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db'
    }
  }
})

async function createAdminInCorrectPath() {
  try {
    console.log('Creating admin in file:./test.db...')
    
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
    
    console.log('✅ Admin created:', admin.email)
    
    // Verify it exists
    const foundAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (foundAdmin) {
      console.log('✅ Admin verified in database:', foundAdmin.email)
    } else {
      console.log('❌ Admin not found after creation')
    }
    
    // List all users
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    })
    console.log('All users in database:', users)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminInCorrectPath()
