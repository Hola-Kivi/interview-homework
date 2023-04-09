import { hashPassword } from '@/lib/auth';
import { db } from '@/lib/db';
import { TASK_STATUS } from '@prisma/client';

import example from './example2.json';

const getRandomTaskStatus = () => {
  const statuses = [
    TASK_STATUS.COMPLETED,
    TASK_STATUS.NOT_STARTED,
    TASK_STATUS.STARTED,
  ];

  return statuses[Math.floor(Math.random() * statuses.length)];
};

async function main() {
  const chapters = example.data.outlines.reduce((res: any[], item) => {
    item.lectures.forEach((lecture) => {
      res.push({
        title: lecture.title ?? lecture.en_title ?? '',
        cover: lecture.resource.cover_url,
        url: lecture.resource.content[0].url,
      });
    });

    return res;
  }, []);

  console.log(chapters);

  console.log(db.user);
  const user = await db.user.upsert({
    where: { email: 'user@email.com' },
    update: {},
    create: {
      email: 'user@email.com',
      firstName: 'Trevor',
      lastName: 'Person',
      password: await hashPassword('password'),
      projects: {
        create: new Array(5).fill(1).map((_, i) => ({
          name: `Project ${i}`,
          due: new Date(2023, 1, 31),
        })),
      },
      videos: {
        create: new Array(5).fill(1).map((_, i) => ({
          name: `${example.data.outlines[i].title}`,
          title: `${example.data.outlines[i].en_title}`,
          description: `${example.data.outlines[i].description}`,
          pic: example.data.outlines[i].cover_url,
          chapters: {
            createMany: {
              data: chapters,
            },
          },
        })),
      },
    },
    include: {
      projects: true,
      videos: true,
    },
  });

  const tasks = await Promise.all(
    user.projects.map((project) =>
      db.task.createMany({
        data: new Array(10).fill(1).map((_, i) => {
          return {
            name: `Task ${i}`,
            ownerId: user.id,
            projectId: project.id,
            description: `Everything that describes Task ${i}`,
            status: getRandomTaskStatus(),
          };
        }),
      })
    )
  );
  console.log({ user, tasks });

  const comments = await Promise.all(
    user.videos.map((video) =>
      db.comment.createMany({
        data: new Array(5).fill(1).map((_, i) => {
          return {
            ownerId: user.id,
            videoId: video.id,
            text: `Comment ${i} is published`,
          };
        }),
      })
    )
  );
  console.log({ user, comments });

  const videoLikes = await Promise.all(
    user.videos.map((video) =>
      db.videoLike.createMany({
        data: new Array(5).fill(1).map((_, i) => {
          return {
            ownerId: user.id,
            videoId: video.id,
            like: 1,
          };
        }),
      })
    )
  );
  console.log({ user, videoLikes });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await db.$disconnect();
    process.exit(1);
  });
