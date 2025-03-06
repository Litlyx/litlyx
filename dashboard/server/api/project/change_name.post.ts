
export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const { project } = data;

    const { name } = await readBody(event);

    if (name.trim()) return setResponseStatus(event, 400, 'name is required');
    if (name.trim().length < 2) return setResponseStatus(event, 400, 'name too short');
    if (name.trim().length > 32) return setResponseStatus(event, 400, 'name too long');

    project.name = name.trim();
    await project.save();

    return { ok: true };

});