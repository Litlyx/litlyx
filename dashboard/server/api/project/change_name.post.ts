
export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false, allowGuests: false, allowLitlyx: false });
    if (!data) return;

    const { project } = data;

    const { name } = await readBody(event);

    if (name.length == 0) return setResponseStatus(event, 400, 'name is required');

    project.name = name;
    await project.save();

    return { ok: true };

});