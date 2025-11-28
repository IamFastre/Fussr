import { getQuestionByUUID } from '$/server/funcs/questions';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const question = await getQuestionByUUID(params.uuid);
  return { question };
};
