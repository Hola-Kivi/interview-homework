'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import limit from '@/lib/limit';
import { uploadVideo } from '@/lib/api';
import { request } from '@/lib/requestXML';
import Button from '@/components/Button';
import clsx from 'clsx';
import Card from './Card';

type userId = {
  userId: string;
};
type resultReq = { shouldUpload: boolean; uploadList: []; url?: string };
type FileBlob = {
  file: Blob;
}[];
interface FileIndex {
  [index: string]: FileBlob;
}

let splitFilename = (prop = '') => {
  return prop.slice(0, prop.lastIndexOf('_'));
};

const NewPost = ({ userId }: userId) => {
  const router = useRouter();

  const [videoAsset, setVideoAsset] = useState('');

  const [files, setFiles] = useState<File[]>();
  const [progress, setProgress] = useState<number>(0);
  const fileSize = useRef(Number.MAX_SAFE_INTEGER);
  const loadedArr = useRef<number[]>([]);

  const targetRequest = useRef<FileIndex>();

  const fileAccept = '.mp4, .webm, .ogg';
  const CHUNK_SIZE = 1024 * 1024 * 1;
  const MAX_POOL = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);
    setProgress(0);
    targetRequest.current = {};
    fileSize.current = 0;
    loadedArr.current.length = 0;

    if (!e.target.files || e.target.files.length <= 0) return;

    const arrFiles = Array.from(e.target.files);
    setFiles(arrFiles);
  };
  const handleChunk = (file: File) => {
    fileSize.current = file.size;

    let fileChunk = [];
    let cur = 0;

    while (cur < file.size) {
      fileChunk.push({
        file: file.slice(cur, CHUNK_SIZE + cur),
      });
      cur += CHUNK_SIZE;
    }
    return fileChunk;
  };
  const createChunk = (files: File[]) => {
    let fileChunk = files.reduce((prev, cur, index) => {
      prev[`${cur.name}_${index}`] = handleChunk(cur);

      return prev;
    }, {} as FileIndex);

    return fileChunk;
  };
  const calcHash = async (fileChunkList: FileBlob) => {
    return new Promise<string>((resolve) => {
      const worker = new Worker('/md5-script/hash.js');

      worker.postMessage({ fileChunkList });
      worker.onmessage = (e) => {
        const { percentage, hash } = e.data;
        const hashPercentage = percentage;
        if (hash) {
          resolve(hash);
        }
      };
    });
  };
  const verifyUpload = async (filename: string, hash: string) => {
    return new Promise<resultReq>(async (resolve, reject) => {
      const data = await request({
        method: 'POST',
        url: '/api/verify',
        data: JSON.stringify({
          filename,
          hash,
          userId,
        }),
      });
      resolve(data);
    });
  };
  const mergeFile = async (filename: string, hash: string) => {
    return new Promise<resultReq>(async (resolve) => {
      const merge = await request({
        data: JSON.stringify({ filename, hash, userId, CHUNK_SIZE }),
        method: 'POST',
        url: '/api/merge',
      });
      resolve(merge);
    });
  };

  const onUploadProgress = (e: ProgressEvent, i: number) => {
    loadedArr.current[i] = e.loaded * 100;
    let curTotal = loadedArr.current.reduce((acc, cur) => acc + cur, 0);

    let percentage = parseInt((curTotal / fileSize.current).toFixed(2));

    console.log(percentage);

    setProgress(percentage);
  };

  const uploadFiles = async () => {
    if (!files) return;
    const fileChunkList = createChunk(files);

    targetRequest.current = fileChunkList;

    for (let key in targetRequest.current) {
      let fileName = splitFilename(key);
      let hash = await calcHash(targetRequest.current[key]);

      const { shouldUpload, uploadList } = await verifyUpload(fileName, hash);

      if (shouldUpload !== undefined) {
        if (typeof shouldUpload === 'boolean') {
          if (!shouldUpload) {
            console.log('秒传成功');
          } else {
            console.log('验证OK');
            await createDataFormRequest(key, hash, fileName, uploadList);
          }
        } else {
          await createDataFormRequest(key, hash, fileName, uploadList);
        }
      } else {
        console.log('验证失败');
      }
    }
  };
  const createDataFormRequest = async (
    key: string,
    hash: string,
    fileName: string,
    uploadedFiles: []
  ) => {
    let requestList = targetRequest.current?.[key].map((chunk, index) => {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('filename', fileName);
      formData.append('hash', hash);
      formData.append('chunkIndex', String(index));
      formData.append('file', chunk['file']);

      return formData;
    });
    if (!requestList) return;

    const workers = await limit({ requestList, MAX_POOL, onUploadProgress });

    Promise.allSettled(workers).then((res) => {
      if (
        uploadedFiles.length + res.length <=
        targetRequest.current![key].length
      ) {
        mergeFile(fileName, hash).then(async (res) => {
          const dbUrl = res.url as string;
          await uploadVideo({ fileName, dbUrl, hash });
          setVideoAsset(`/api/player/${hash}`);

          console.log('上传成功');
          router.refresh();
        });
      }
    });
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
  });
  return (
    <div className="m-4 text-gray-700 lg:px-6 lg:py-4">
      <label className="mb-4 flex flex-col border-2 border-gray-100 border-dashed rounded-lg hover:border-gray-700 hover:bg-gray-100/20">
        <div className="flex flex-col items-center justify-center pt-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-center pt-1 text-sm lg:text-base tracking-tight text-gray-600 group-hover:text-gray-800">
            Attach files <br />
            .MP4 or .WebM or .ogg
          </p>
        </div>
        <input
          type="file"
          accept={fileAccept}
          multiple
          onChange={handleChange}
          className="opacity-0"
        />
      </label>
      <div className="mt-6 text-center">
        <Button intent="secondary" onClick={uploadFiles}>
          Upload
        </Button>
      </div>
      {progress != 0 && (
        <Card className="py-4 mt-8 border-x-white">
          {files?.map((file) => (
            <div key={file.name}>
              <div className="mb-2">
                <span className="text-base md:text-xl text-gray-600">
                  {file.name}
                </span>
              </div>
              <div>
                <div className="w-full h-2 bg-violet-200 rounded-full mb-2">
                  <div
                    className={clsx(
                      'h-full text-center text-xs md:text-sm text-white bg-violet-600 rounded-full'
                    )}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-sm md:text-base text-gray-600 font-semibold">
                    {`${progress}%`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default NewPost;
