require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestAdmin() {
  try {
    // Check if test admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    })

    if (existingAdmin) {
      console.log('Test admin already exists')
      
      // Make sure they are admin
      if (!existingAdmin.isAdmin) {
        await prisma.user.update({
          where: { email: 'admin@test.com' },
          data: { isAdmin: true }
        })
        console.log('Updated existing user to admin')
      }
      
      return
    }

    // Create test admin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Test Admin',
        password: hashedPassword,
        isAdmin: true,
        emailVerified: new Date(),
      }
    })

    console.log('Test admin created successfully!')
    console.log('Email: admin@test.com')
    console.log('Password: admin123')
    console.log('ID:', admin.id)
    
  } catch (error) {
    console.error('Error creating test admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestAdmin()
