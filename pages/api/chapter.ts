import { NextApiRequest, NextApiResponse } from 'next';
import { beSerializable } from '@/lib/beSerializable';

import dummyData from '@/prisma/staticData.json' assert { type: 'json' };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    data: beSerializable(dummyData.lectures.slice(0, 10)),
    nextCursor: dummyData.lectures[10].id,
  });
}
