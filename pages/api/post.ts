import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import fse from 'fs-extra';
import multer from 'multer';
import path from 'path';

type ReqFile = NextApiRequest & { file: File };
const apiRoute = nextConnect<ReqFile, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { userId, hash } = req.body;

    const UPLOAD_DIR = path.resolve(process.cwd(), `uploads/${userId}`);

    const dest = path.resolve(UPLOAD_DIR, hash);
    fse.promises.mkdir(dest, { recursive: true });

    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.chunkIndex);
  },
});

const upload = multer({
  storage,
});

apiRoute.post(
  upload.fields([
    {
      name: 'file',
      maxCount: 100,
    },
  ]),
  async (req, res) => {
    if (req.files) {
      res.status(200).json({ data: 'received chunked files' });
    } else {
      res.status(400).json({ data: 'uploads failed' });
    }
  }
);

export default apiRoute;
export const config = {
  api: {
    bodyParser: false,
  },
};
