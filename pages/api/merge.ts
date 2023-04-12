import { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import fse from 'fs-extra';
import { splitExtMerge } from '@/lib/splitExt';
import { validateJWT } from '@/lib/auth';

const pipeStream = (path: string, writeSteam: fse.WriteStream) => {
  return new Promise<void>((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on('end', (err: Error) => {
      if (err) throw err;
      resolve();
    });
    readStream.pipe(writeSteam, { end: false });
  });
};

export default async function verifyUploadApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.COOKIE_NAME) return;
  const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);
  if (!user) return;

  if (req.method === 'POST') {
    const { filename, hash, userId, CHUNK_SIZE } = JSON.parse(req.body);
    const UPLOAD_DIR = path.resolve(process.cwd(), `assets/uploads/${userId}`);

    const { ext } = splitExtMerge(filename);
    const tempDir = path.resolve(UPLOAD_DIR, hash);
    const cD = path.resolve(UPLOAD_DIR, `${hash}.${ext}`);

    const videoURL = cD;

    fse.readdir(tempDir, (err, chunkPaths) => {
      chunkPaths.sort((a, b) => Number(a) - Number(b));

      Promise.all(
        chunkPaths.map((chunkPath, index) => {
          return pipeStream(
            path.resolve(tempDir, chunkPath),
            fse.createWriteStream(cD, {
              start: index * CHUNK_SIZE,
              end: (index + 1) * CHUNK_SIZE,
            })
          );
        })
      ).then(() => {
        fse.removeSync(tempDir);
      });

      res.json({
        status: 200,
        msg: 'file merged success',
        url: videoURL,
      });
    });
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
