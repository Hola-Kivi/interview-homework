import { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import fse from 'fs-extra';
import { validateJWT } from '@/lib/auth';

const splitExt = (filename: string) => {
  let name = filename.slice(0, filename.lastIndexOf('.'));
  let ext = filename.slice(filename.lastIndexOf('.') + 1, filename.length);
  return { name, ext };
};
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
  // const user = await validateJWT(req.cookies[process.env.COOKIE_NAME]);

  if (req.method === 'POST') {
    const { filename, hash, userId, CHUNK_SIZE } = JSON.parse(req.body);
    const UPLOAD_DIR = path.resolve(__dirname, `../uploads/${userId}`);

    const { ext } = splitExt(filename);
    const tempDir = path.resolve(UPLOAD_DIR, hash);
    const cD = path.resolve(UPLOAD_DIR, `${hash}.${ext}`);

    const url = 'http://' + req.headers.host;
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
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

//   .sort((a, b) => Number(a) - Number(b))
//   .forEach((chunkPath) => {
//     // 合并文件
//     fse.appendFileSync(
//       path.resolve(UPLOAD_DIR, `${hash}.${ext}`),
//       fse.readFileSync(`${tempDir}/${chunkPath}`)
//     );
//   });
// // 删除临时文件夹
// fse.removeSync(tempDir);
// // 返回文件地址
// req.body = '合并成功';

// res.status(201).json(req.body);

// const resolvePost = (req: NextApiRequest) => {
//   return new Promise((resolve) => {
//     let chunk = '';
//     req.on('data', (data) => {
//       chunk += data;
//     });
//     req.on('end', () => {
//       resolve(JSON.parse(chunk));
//     });
//   });
// };
