require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const deleteSignatures = async () => {
  try {
    await prisma.guestbook.deleteMany({});
    console.log('All signatures have been deleted.');
  } catch (error) {
    console.error('Error deleting signatures:', error);
  } finally {
    await prisma.$disconnect();
  }
};

deleteSignatures();