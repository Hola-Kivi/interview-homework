import { cookies } from 'next/headers';

import { getUserFromCookie } from '@/lib/auth';
import NewPost from '@/components/NewPost';

export default async function Page() {
  let user = await getUserFromCookie(cookies());
  if (!user) return;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <NewPost userId={user.id} />
    </div>
  );
}
