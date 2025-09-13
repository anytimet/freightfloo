const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function checkAndCreateAdmin() {
  try {
    // Check if admin exists
    let admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (admin) {
      console.log('Admin exists:', admin.email)
      // Test password
      const isValid = await bcrypt.compare('admin123', admin.password)
      console.log('Password valid:', isValid)
    } else {
      console.log('Creating new admin...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      admin = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: 'admin@freightfloo.com',
          password: hashedPassword,
          role: 'ADMIN',
          userType: 'INDIVIDUAL',
          emailVerified: true
        }
      })
      
      console.log('Admin created:', admin.email)
    }
    
    // List all users
    const users = await prisma.user.findMany({
      select: { email: true, role: true, createdAt: true }
    })
    console.log('All users:', users)
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndCreateAdmin()
