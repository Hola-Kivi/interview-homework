import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { beSerializable } from '@/lib/beSerializable';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId, cursor } = req.query;
  if (!videoId) {
    res.status(400).json({ message: 'videoId is required' });
  }

  const data = await db.chapter.findMany({
    cursor: cursor && {
      id: cursor as string,
    },
    take: 11,
    where: {
      videoId: videoId as string,
    },
  });

  res.status(200).json({
    data: beSerializable(data.slice(0, 10)),
    nextCursor: data[10]?.id,
  });
}
