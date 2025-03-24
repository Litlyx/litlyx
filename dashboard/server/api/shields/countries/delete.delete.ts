import { CountryBlacklistModel } from "~/shared/schema/shields/CountryBlacklistSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const body = await readBody(event);
    const { country } = body;

    const removal = await CountryBlacklistModel.deleteOne({ project_id: data.project_id, country });

    return { ok: removal.deletedCount == 1 };
});