const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email)
      return
    }

    // Create admin user
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

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@freightfloo.com')
    console.log('🔑 Password: admin123')
    console.log('🔗 Login at: http://localhost:3000/auth/signin')
    console.log('📊 Admin dashboard: http://localhost:3000/dashboard/admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
