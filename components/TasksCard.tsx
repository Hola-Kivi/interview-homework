import { cookies } from 'next/headers';
import { TASK_STATUS } from '@prisma/client';

import { getUserFromCookie } from '@/lib/auth';
import { taskProps } from '@/lib/Types';
import { db } from '@/lib/db';

import Button from '@/components/Button';
import Card from '@/components/Card';
import { getTranslation } from '@/i18n/getDictionary';
import { ValidLocale } from '@/i18n/i18n-config';

const getScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang);

  const projectScript = {
    newTask: translate('project.newTask'),
    null: translate('project.null'),
  };
  return projectScript;
};

const getData = async () => {
  const user = await getUserFromCookie(cookies());
  const tasks = await db.task.findMany({
    where: {
      ownerId: user?.id,
      NOT: {
        status: TASK_STATUS.COMPLETED,
        deleted: false,
      },
    },
    take: 5,
    orderBy: {
      due: 'asc',
    },
  });

  return tasks;
};

const TasksCard = async ({ title, tasks, lang }: taskProps) => {
  const data = tasks || (await getData());
  const projectScript = await getScript(lang);

  return (
    <Card className="w-full mt-14">
      <div>
        <span className="text-3xl text-gray-600">{title}</span>
      </div>
      <div className="text-right">
        <Button intent="text" className="text-violet-600">
          {projectScript.newTask}
        </Button>
      </div>

      {data && data.length ? (
        <>
          {data.map((task) => (
            <div className="py-2" key={task.name}>
              <div>
                <span className="text-gray-800">{task.name}</span>
              </div>
              <div>
                <span className="text-gray-400 text-sm">
                  {task.description}
                </span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div>{projectScript.null}</div>
      )}
    </Card>
  );
};

export default TasksCard;
