
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { UserModel } from "@schema/UserSchema";
import { EmailServiceHelper } from "~/server/services/EmailServiceHelper";
import { EmailService } from "~/shared/services/EmailService";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const { project_id, project } = data;

    const { email } = await readBody(event);

    const targetUser = await UserModel.findOne({ email });


    const link = `http://127.0.0.1:3000/accept_invite?project_id=${project_id.toString()}`;

    if (!targetUser) {

        const exist = await TeamMemberModel.exists({ project_id, email });
        if (exist) return setResponseStatus(event, 400, 'Member already invited');

        await TeamMemberModel.create({
            project_id,
            email,
            pending: true,
            role: 'GUEST'
        });

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('invite_project_noaccount', {
                target: email,
                projectName: project.name,
                link
            });
            EmailServiceHelper.sendEmail(emailData);
        });

        return { ok: true };

    } else {

        const exist = await TeamMemberModel.exists({ project_id, user_id: targetUser.id });
        if (exist) return setResponseStatus(event, 400, 'Member already invited');

        await TeamMemberModel.create({
            project_id,
            user_id: targetUser.id,
            pending: true,
            role: 'GUEST'
        });

        setImmediate(() => {
            const emailData = EmailService.getEmailServerInfo('invite_project', {

                target: email,
                projectName: project.name,
                link
            });
            EmailServiceHelper.sendEmail(emailData);
        });

        return { ok: true };

    }



});