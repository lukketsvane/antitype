import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const entries = await prisma.guestbook.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch entries' });
    }
  } else if (req.method === 'POST') {
    const { name, message, signature } = req.body;
    if (!name || !message || !signature) {
      return res.status(400).json({ error: 'Name, message, and signature are required' });
    }

    try {
      const newEntry = await prisma.guestbook.create({
        data: { name, message, signature },
      });
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save entry' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
