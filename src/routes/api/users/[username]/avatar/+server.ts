
import { DICEBEAR_BACKGROUND_COLORS, DICEBEAR_SHAPE_COLORS, DICEBEAR_THUMBS_API } from '$/utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, params }) => {
  const username = params.username.toLowerCase();

  const dicebearUrl = new URL(DICEBEAR_THUMBS_API);

  dicebearUrl.searchParams.set('seed',                                        username);
  dicebearUrl.searchParams.set('shapeColor',           DICEBEAR_SHAPE_COLORS.join(','));
  dicebearUrl.searchParams.set('backgroundColor', DICEBEAR_BACKGROUND_COLORS.join(','));
  dicebearUrl.searchParams.set('size',                                           '256');
  dicebearUrl.searchParams.set('scale',                                           '90');

  const res = await fetch(dicebearUrl, { headers: request.headers });

  return res;
};
