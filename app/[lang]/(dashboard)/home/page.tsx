import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';

import { getUserFromCookie } from '@/lib/auth';
import { langProps } from '@/lib/Types';
import { delay } from '@/lib/async';
import { db } from '@/lib/db';

import GreetingsSkeleton from '@/components/GreetingsSkeleton';
import ProjectCard from '@/components/ProjectCard';
import NewProject from '@/components/NewProject';
import Greetings from '@/components/Greetings';
import TasksCard from '@/components/TasksCard';
import Header from '@/components/Header';
import Carousel, { CarouselItem } from '@/components/Carousel';
import Card from '@/components/Card';

import { ValidLocale } from '@/i18n/i18n-config';
import { getTranslation } from '@/i18n/getDictionary';
import { getRootScript, langSwitcher } from '@/i18n/rootPage';

const getData = async () => {
  await delay(3500);

  let user = await getUserFromCookie(cookies());
  let projects = await db.project.findMany({
    where: {
      ownerId: user?.id,
    },
    include: {
      tasks: true,
    },
  });

  return { projects, user };
};

const getScript = async (lang: ValidLocale) => {
  const translate = await getTranslation(lang);

  const projectScript = {
    projectCard: {
      completed: translate('project.completed'),
    },
    newProject: {
      newProjectBTN: translate('project.newProjectBTN'),
      newProjectMD: translate('project.newProjectMD'),
      createBTN: translate('project.createBTN'),
      inputPlaceholder: translate('project.newProjectName'),
    },
  };
  return projectScript;
};

export default async function Page({ params }: langProps) {
  const { user, projects } = await getData();

  const projectScript = await getScript(params.lang);
  const rootTranscript = await getRootScript(params.lang);

  return (
    <div className="h-full px-2 md:px-6 overflow-y-auto scrollbar-hide">
      <div className="mb-5 mt-4">
        <Header
          lang={params.lang}
          userId={user!.firstName}
          langsIcon={langSwitcher}
          headerTranscript={rootTranscript.common}
        />
      </div>

      <Suspense fallback={<GreetingsSkeleton />}>
        {/* @ts-expect-error Server Component */}
        <Greetings lang={params.lang} />
      </Suspense>

      <div className="">
        <Carousel className="py-4 px-10 mt-8 flex flex-col items-center justify-center overflow-hidden">
          {projects.map((project) => (
            <CarouselItem key={project.id}>
              <Link href={`/${params.lang}/project/${project.id}`}>
                <Card className="">
                  <ProjectCard
                    project={project}
                    transcript={projectScript.projectCard}
                  />
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </Carousel>
        <NewProject script={projectScript.newProject} />
      </div>

      {/* @ts-expect-error Server Component */}
      <TasksCard lang={params.lang} />
    </div>
  );
}
