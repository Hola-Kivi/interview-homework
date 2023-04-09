import { NextApiRequest, NextApiResponse } from 'next';

import path from 'path';
import fse from 'fs-extra';

const splitExt = (filename: string) => {
  let name = filename.slice(0, filename.lastIndexOf('.'));
  let ext = filename.slice(filename.lastIndexOf('.') + 1, filename.length);
  return { name, ext };
};
const createChunkList = async (filePath: string) => {
  let arr = await fse.readdir(filePath);

  // const res: number[] = [];
  // arr.forEach(async(name) => {
  //   const index = Number(name);
  //   const chunk = await fse.readFile(`${filePath}/${name}`);
  //   res[index] = chunk.length;
  // });
  return arr;
};

export default async function verifyUploadApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename, hash, userId } = JSON.parse(req.body);
  filename.slice(0, filename.lastIndexOf('.'));
  // const UPLOAD_DIR = `uploads/${user}`;
  const UPLOAD_DIR = path.resolve(__dirname, `../uploads/${userId}`);

  if (req.method === 'POST') {
    const { ext } = splitExt(filename);
    const tempDir = path.resolve(UPLOAD_DIR, `${hash}`);

    if (fse.existsSync(path.resolve(UPLOAD_DIR, `${hash}.${ext}`))) {
      console.log('-- uploaded already!');

      return res.json({
        status: 200,
        shouldUpload: false,
      });
    } else if (fse.existsSync(tempDir)) {
      // 续传
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
