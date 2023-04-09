import { validateJWT } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const JWT_TOKEN_KEY = process.env.COOKIE_NAME;
  const user = await validateJWT(req.cookies[JWT_TOKEN_KEY as string]);

  await db.project.create({
    data: {
      name: req.body.name,
      ownerId: user.id,
    },
  });
  res.json({ data: { message: 'ok' } });
}
