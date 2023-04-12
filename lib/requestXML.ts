type resultReq = { shouldUpload: boolean; uploadList: []; url?: string };
type Header = {
  [index: string]: string;
};
type reqParams = {
  url: string;
  method: string;
  data: string | FormData;
  headers?: Header;
  onAbort?(e: XMLHttpRequest): void;
  onUploadProgress?(e: ProgressEvent, i: number): void;
  requestList?: XMLHttpRequest[];
  i?: number;
};

export const request = async ({
  data,
  method,
  url,
  headers,
  onAbort = (xhr) => xhr,
  onUploadProgress,
  i,
}: reqParams) => {
  return new Promise<resultReq>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    onAbort(xhr);

    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', (event) => {
      console.log('--- progress,', event);
    });

    if (onUploadProgress) {
      xhr.upload.addEventListener('load', (e: ProgressEvent) =>
        onUploadProgress(e, i as number)
      );
    }

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
