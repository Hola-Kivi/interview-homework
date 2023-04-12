import { request } from '@/lib/requestXML';

type Props = {
  requestList: FormData[];
  MAX_POOL: number;
  onUploadProgress(e: ProgressEvent): void;
};

export default async function limit({
  requestList,
  MAX_POOL,
  onUploadProgress,
}: Props) {
  async function runTasks(tasksIterator: Array<any>) {
    for (const values of tasksIterator) {
      try {
        await request({
          data: values,
          method: 'POST',
          url: '/api/post',
          onUploadProgress,
        });
      } catch (error: any) {
        new Error(`Failed with: ${error.message}`);
      }
    }
  }
  const valve = Math.min(requestList.length, MAX_POOL);

  const workers = new Array(valve).fill(requestList.values()).map(runTasks);

  return workers;
}
