import { NextApiRequest, NextApiResponse } from 'next';

import { validateJWT } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function postVideo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    if (!process.env.COOKIE_NAME) return;
    const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

    if (!user) {
      res.status(402);
      res.json({ error: 'Invalid admin' });
    }

    const { fileName, dbUrl, hash } = req.body.videoInfo;

    await db.video.create({
      data: {
        name: fileName,
        videoURL: dbUrl,
        pic: 'https://gcdp.oss-cn-qingdao.aliyuncs.com/201603/3/1457033876277_6635.jpg',
        userId: user.id,
        title: hash,
      },
    });
    res.json({ data: { message: 'request success' } });
  } else {
    res.status(402);
    res.json({});
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
