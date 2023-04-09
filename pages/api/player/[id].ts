import { NextApiRequest, NextApiResponse } from 'next';

import { validateJWT } from '@/lib/auth';
import { db } from '@/lib/db';
import fse from 'fs-extra';
import { delay } from '@/lib/async';

const splitExt = (url: string) => {
  let baseUrl = url.slice(0, url.lastIndexOf('/'));
  let hash = url.slice(url.lastIndexOf('/') + 1, url.length);
  return { baseUrl, hash };
};

const getData = async (hash: string, userId: string) => {
  await delay(3500);

  let videoURL = await db.video.findFirst({
    where: {
      userId,
      title: hash,
    },
    select: {
      videoURL: true,
    },
  });

  return videoURL?.videoURL;
};

export default async function verifyUploadApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    if (!process.env.COOKIE_NAME) return;
    const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);
    if (!user) return;

    const { hash } = splitExt(req.url!);
    const range = req.headers.range;

    if (!range) {
      res.status(400).send('Requires Range header');
    }

    const videoPath = await getData(hash, user.id);
    const videoSize = fse.statSync(videoPath!).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range?.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
      'X-Content-Type-Options': 'nosniff',
    };

    res.writeHead(206, headers);

    const videoStream = fse.createReadStream(videoPath!, { start, end });

    videoStream.pipe(res);
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
