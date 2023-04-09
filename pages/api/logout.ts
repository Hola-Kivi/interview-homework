import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      serialize(process.env.COOKIE_NAME!, '', {
        path: '/',
        maxAge: -1,
      })
    );
    return res.status(200).json({
      success: 'Successfully logged out',
    });
  } else {
    res.status(402);
    res.json({});
  }
}
