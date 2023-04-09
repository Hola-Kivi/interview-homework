'use client';

import { useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import { uploadVideo } from '@/lib/api';
import limit from '@/lib/limit';

type userId = {
  userId: string;
};
type Header = {
  [index: string]: string;
};
type reqParams = {
  url: string;
  method: string;
  data: string | FormData;
  headers?: Header;
  onAbort?(e: XMLHttpRequest): void;
  requestList?: XMLHttpRequest[];
};
type resultReq = { shouldUpload: boolean; uploadList: []; url?: string };
interface FileChunk {
  files: File[];
}
type FileBlob = {
  file: Blob;
}[];
interface FileIndex {
  [index: string]: FileBlob;
}

let splitFilename = (prop = '') => {
  return prop.slice(0, prop.lastIndexOf('_'));
};
export const request = async ({
  data,
  method,
  url,
  headers,
  onAbort = (xhr) => xhr,
}: reqParams) => {
  return new Promise<resultReq>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    onAbort(xhr);

    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (event) => {
      // console.log('--- progress,', event);
    });
    xhr.upload.addEventListener('load', (event) => {
      // console.log('--- load,', event);
    });
    xhr.upload.addEventListener('error', (event) => {
      console.log('--- error,', event);
    });

    xhr.open(method, url);
    if (headers) {
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
    }
    xhr.send(data);
    // xhr.onload = () => {
    // this.ary = ary.filter((item) => item !== xhr);
    //   resolve(JSON.parse(xhr.response));
    // };
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };
  });
};

const NewPost = ({ userId }: userId) => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [videoAsset, setVideoAsset] = useState('');
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>();

  const [progress, setProgress] = useState('0');

  const targetRequest = useRef<FileIndex>();
  const progressArr = useRef<number[]>([]);

  const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const CHUNK_SIZE = 1024 * 1024 * 1; // 切片大小1MB
  const MAX_POOL = 3; // 最大并发数

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);
    targetRequest.current = {};
    if (!e.target.files || e.target.files.length <= 0) return;

    const arrFiles = Array.from(e.target.files);
    setFiles(arrFiles);
  };
  const handleChunk = (file: File) => {
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
  const createProgressHandler = (item: any) => {
    return (e: ProgressEvent) => {
      item.precentage = parseInt(String((e.loaded / e.total) * 100));
    };
  };
  const createCancelHandler = (xhr: XMLHttpRequest) => {
    // ary.push(xhr);
  };
  // ts1005-error, expected ':'
  const createDataFormRequest = async (
    key: string,
    hash: string,
    fileName: string,
    uploadedFiles: []
  ) => {
    const handleUpload = async () => {
      setLoading(true);
      try {
        // router.refresh();
      } catch (e) {
        setError('Error...');
      } finally {
        setLoading(false);
      }
    };

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

    const workers = await limit(requestList, MAX_POOL);

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
        });
      }
    });
  };
  const verifyUpload = async (filename: string, hash: string) => {
    return new Promise<resultReq>(async (resolve, reject) => {
      // const data = await verifyUploadApi({ filename, hash, user });

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
            // setProgress('100');
          } else {
            console.log('验证OK');
            await createDataFormRequest(key, hash, fileName, uploadList);
          }
        } else {
          // continue...
          await createDataFormRequest(key, hash, fileName, uploadList);
        }
      } else {
        console.log('验证失败');
      }
    }
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
  const handleFinishedUploadProgress = (size: number, chunkIndex: number) => {
    console.log('finished 100%');
    // progressArr.current[chunkIndex] = size * 100;
    // const curTotal = progressArr.current.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue,
    //   0
    // );
    // setProgress((curTotal / totalSize.current).toFixed(2));
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
          // accept={fileAccept}
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
    </div>
  );
};

export default NewPost;
