import { success } from '$/server/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return success("OK");
};
