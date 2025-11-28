import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";

export default defineEventHandler(async event => {

  const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'limit', 'permission:webAnalytics', 'flag:allowShare');
  const { pid, project_id, domain, from, to, limit } = ctx;

  const { utm_type } = getQuery(event);

  const cacheKey = `data:utm:${utm_type}:${pid}:${limit}:${from}:${to}:${domain}`;
  const cacheExp = 60;

  return await Redis.useCache(cacheKey, cacheExp, async () => {

    const websiteMatch = domain ? { website: domain } : {};

    const result = await VisitModel.aggregate([
      {
        $match: {
          project_id,
          created_at: { $gte: new Date(from), $lte: new Date(to) },
          ...websiteMatch,
          [`utm_${utm_type}`]: { $ne: null }
        }
      },
      {
        $group: {
          _id: `$utm_${utm_type}`,
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return result.map(item => ({
      _id: item._id ?? 'unknown',
      count: item.count
    }));

  });

});
