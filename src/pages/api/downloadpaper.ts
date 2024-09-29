import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { downloadPaper } from '@/app/api/service/fetchDownloadPaper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    const { path } = req.query;
  
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    if (typeof path !== 'string') {
      return res.status(400).json({ message: 'Invalid path' });
    }
  
    try {
      const buffer = await downloadPaper(session, path);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${path.split('/').pop()}"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error in API route:", error);
      res.status(500).json({ message: 'Failed to fetch and download paper' });
    }
  }