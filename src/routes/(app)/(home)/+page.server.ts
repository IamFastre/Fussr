import { getQuestionsLatest } from '$/server/funcs/questions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const questions = await getQuestionsLatest() ?? [];

  return { questions };
};
