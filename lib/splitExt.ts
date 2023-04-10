export const splitExt = (url: string) => {
  let file = url.slice(url.lastIndexOf('/') + 1, url.length);
  let filename = file.slice(0, file.lastIndexOf('.'));

  return filename;
};

export const splitExtMerge = (filename: string) => {
  let name = filename.slice(0, filename.lastIndexOf('.'));
  let ext = filename.slice(filename.lastIndexOf('.') + 1, filename.length);
  return { name, ext };
};

export const splitExtPlayer = (url: string) => {
  let baseUrl = url.slice(0, url.lastIndexOf('/'));
  let hash = url.slice(url.lastIndexOf('/') + 1, url.length);
  return { baseUrl, hash };
};
