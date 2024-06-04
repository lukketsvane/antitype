import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, message, signature } = req.body;

    if (!name || !message || !signature) {
      return res.status(400).json({ error: 'Name, message, and signature are required' });
    }

    try {
      const newEntry = await prisma.guestbook.create({
        data: {
          name,
          message,
          signature,
        },
      });
      return res.status(201).json(newEntry);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error creating entry' });
    }
  } else if (req.method === 'GET') {
    try {
      const entries = await prisma.guestbook.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(entries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching entries' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}