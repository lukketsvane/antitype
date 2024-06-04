import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else if (req.method === 'GET') {
    try {
      const entries = await prisma.guestbook.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(entries);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};