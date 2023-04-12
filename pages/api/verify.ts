import { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import fse from 'fs-extra';
import { splitExtMerge } from '@/lib/splitExt';

const createChunkList = async (filePath: string) => {
  let arr = await fse.readdir(filePath);

  return arr;
};

export default async function verifyUploadApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename, hash, userId } = JSON.parse(req.body);
  filename.slice(0, filename.lastIndexOf('.'));

  const UPLOAD_DIR = path.resolve(process.cwd(), `uploads/userId`);

  if (req.method === 'POST') {
    const { ext } = splitExtMerge(filename);
    const tempDir = path.resolve(UPLOAD_DIR, `${hash}`);

    if (fse.existsSync(path.resolve(UPLOAD_DIR, `${hash}.${ext}`))) {
      console.log('-- uploaded already!');

      return res.json({
        status: 200,
        shouldUpload: false,
      });
    } else if (fse.existsSync(tempDir)) {
      return res.json({
        status: 200,
        shouldUpload: true,
        uploadList: await createChunkList(tempDir),
      });
    } else {
      return res.json({
        status: 200,
        shouldUpload: true,
        uploadList: [],
      });
    }
  } else {
    res.status(402);
    res.json({});
  }
}
