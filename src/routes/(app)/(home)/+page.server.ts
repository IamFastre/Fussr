import { getQuestionsLatest } from '$/server/funcs/questions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const questions = await getQuestionsLatest({ page:1 });

  return { questions };
};
