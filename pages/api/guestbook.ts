// pages/api/guestbook.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const entries = await prisma.guestbook.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.json(entries);
    } catch (error) {
      console.error('Error fetching guestbook entries', error);
      return res.status(500).json({ message: 'Error fetching guestbook entries' });
    }
  }

  if (req.method === 'POST') {
    const { message, signature } = req.body;
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    // Save signature as image file
    const fileName = `signature-${Date.now()}.png`;
    const filePath = join(process.cwd(), 'public', 'signatures', fileName);

    try {
      await writeFile(filePath, base64Data, 'base64');

      const newEntry = await prisma.guestbook.create({
        data: {
          message,
          signature: `/signatures/${fileName}`,
          name: 'Anonymous', // Use 'Anonymous' for now
          createdAt: new Date(),
        },
      });

      return res.status(201).json(newEntry);
    } catch (error) {
      console.error('Error saving guestbook entry', error);
      return res.status(500).json({ message: 'Error saving guestbook entry' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};