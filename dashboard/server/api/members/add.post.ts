
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";
import { z } from "zod";
import { getPlanFromId } from "~/shared/data/PLANS";
import { PremiumModel } from "~/shared/schema/PremiumSchema";

const ZEmailBody = z.object({
    email: z.string().email('Not a valid email')
});

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');
    const { project_id, user_id, project } = ctx;

    const { email } = await readValidatedBody(event, ZEmailBody.parse);

    const { BASE_URL } = useRuntimeConfig();

    const link = `${BASE_URL}/accept_invite?project_id=${project_id.toString()}`;

    const premiumData = await PremiumModel.findOne({ user_id });
    if (!premiumData) throw createError({ status: 400, message: 'Error getting premiumData. Please contact support.' });

    const price = getPlanFromId(premiumData.premium_type);
    if (!price) throw createError({ status: 400, message: 'Error getting price. Please contact support.' });

    const maxMembers = price.features.members;
    const currentMembers = await TeamMemberModel.countDocuments({ project_id });

    if (currentMembers >= maxMembers) throw createError({ status: 400, message: 'MEMBERS_LIMIT_REACHED' });

    const targetUser = await UserModel.findOne({ email });

    if (targetUser) {

        if (targetUser._id.toString() == user_id) throw createError({ status: 400, message: 'Cannot invite yourself' });

        const exists = await TeamMemberModel.exists({ project_id, user_id });
        if (exists) throw createError({ status: 400, message: 'Member already invited' });

        await TeamMemberModel.create({
            project_id,
            user_id: targetUser.id,
            pending: true,
            role: 'GUEST',
            permission: {
                webAnalytics: true,
                events: false,
                ai: false,
                domains: ['*']
            }
        });

        setImmediate(() => {
            const tRpc = useTRPC();
            tRpc.emails.email.sendInviteEmail.mutate({ email, project_name: project.name, link });
        });


    } else {


        const exist = await TeamMemberModel.exists({ project_id, email });
        if (exist) return setResponseStatus(event, 400, 'Member already invited');

        await TeamMemberModel.create({
            project_id,
            email,
            pending: true,
            role: 'GUEST',
            permission: {
                webAnalytics: true,
                events: false,
                ai: false,
                domains: ['*']
            }
        });


        setImmediate(() => {
            const tRpc = useTRPC();
            tRpc.emails.email.sendInviteEmail.mutate({ email, project_name: project.name, link });
        });


    }


    return { ok: true };


});