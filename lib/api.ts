export interface authParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface apiParams {
  url: string;
  method: string;
  body: authParams | '' | {};
  json?: boolean;
}
interface uploadParams {
  fileName: string;
  dbUrl: string;
  hash: string;
}

export const fetcher = async ({
  url,
  method,
  body,
  json = true,
}: apiParams) => {
  const res = await fetch(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('API error');
  }
  if (json) {
    const data = await res.json();

    return data.data;
  }
};

export const register = (user: authParams) => {
  return fetcher({ url: '/api/register', method: 'post', body: user });
};
export const login = (user: authParams) => {
  return fetcher({ url: '/api/login', method: 'post', body: user });
};
export const logout = () => {
  return fetcher({ url: '/api/logout', method: 'post', body: '' });
};

export const createNewProject = (name: string) => {
  return fetcher({
    url: '/api/project',
    method: 'POST',
    body: { name },
  });
};
export const uploadVideo = (videoInfo: uploadParams) => {
  return fetcher({
    url: '/api/postVideo',
    method: 'POST',
    body: { videoInfo },
  });
};
export const getVideo = (videoSrc: string) => {
  return fetcher({
    url: `/api/player/${videoSrc}`,
    method: 'POST',
    body: { videoSrc },
  });
};
