import { getQuestionsLatest } from '$/server/funcs/questions';
import { getTagList } from '$/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const tags = getTagList(params.tag);
  const questions = await getQuestionsLatest({ page:1, tags });

  return { tags, questions };
};
