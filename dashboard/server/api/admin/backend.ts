

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;


    const queueRes = await fetch("http://94.130.182.52:3031/metrics/queue");
    const queue = await queueRes.json();
    const durationsRes = await fetch("http://94.130.182.52:3031/metrics/durations");
    const durations = await durationsRes.json();

    return { queue, durations: durations }


});