import type { AuthContext } from "../middleware/01-authorization";
import type { EventHandlerRequest, H3Event } from 'h3'
import { allowedModels, TModelName } from "../services/DataService";
import { LITLYX_PROJECT_ID } from "@data/LITLYX";
import { ProjectModel, TProject } from "@schema/ProjectSchema";
import { Model, Types } from "mongoose";
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { Slice } from "@services/DateService";

export function getRequestUser(event: H3Event<EventHandlerRequest>) {
    if (!event.context.auth) return;
    return event.context.auth as AuthContext;
}

export function getRequestProjectId(event: H3Event<EventHandlerRequest>) {
    if (!event.context.params) return;
    return event.context.params['project_id'];
}

export function getRequestAddress(event: H3Event<EventHandlerRequest>) {
    if (process.dev) return '127.0.0.1';
    return event.headers.get('x-real-ip') || event.headers.get('X-Forwarded-For') || '0.0.0.0';
}


export type GetRequestDataOptions = {
    /** @default true */ allowGuests?: boolean,
    /** @default false */ requireSchema?: boolean,
    /** @default true */ allowLitlyx?: boolean,
    /** @default false */ requireSlice?: boolean,
    /** @default true */ requireRange?: boolean,
}

async function hasAccessToProject(user_id: string, project: TProject) {
    if (!project) return [false, 'NONE'];
    const owner = project.owner.toString();
    const project_id = project._id;
    if (owner === user_id) return [true, 'OWNER'];
    const isGuest = await TeamMemberModel.exists({ project_id, user_id });
    if (isGuest) return [true, 'GUEST'];
    return [false, 'NONE'];
}


export async function getRequestData(event: H3Event<EventHandlerRequest>, options?: GetRequestDataOptions) {

    const requireSchema = options?.requireSchema || false;
    const allowGuests = options?.allowGuests || true;
    const allowLitlyx = options?.allowLitlyx || true;
    const requireSlice = options?.requireSlice || false;
    const requireRange = options?.requireRange || false;

    const pid = getHeader(event, 'x-pid');
    if (!pid) return setResponseStatus(event, 400, 'x-pid is required');

    const slice = getHeader(event, 'x-slice') as Slice;
    if (!slice && requireSlice) return setResponseStatus(event, 400, 'x-slice is required');

    const from = getRequestHeader(event, 'x-from');
    const to = getRequestHeader(event, 'x-to');
    if (requireRange) {
        if (!from || !to) return setResponseStatus(event, 400, 'x-from and x-to are required');
    }


    let model: Model<any> = undefined as any;

    const schemaName = getRequestHeader(event, 'x-schema');
    if (requireSchema) {
        if (!schemaName) return setResponseStatus(event, 400, 'x-schema is required');
        if (!Object.keys(allowedModels).includes(schemaName)) return setResponseStatus(event, 400, 'x-schema value is not valid');
        const allowedModel = allowedModels[schemaName as TModelName];
        model = allowedModel.model;
    }


    const limitHeader = getRequestHeader(event, 'x-limit');
    const limitNumber = parseInt(limitHeader as string);
    const limit = isNaN(limitNumber) ? 10 : limitNumber;

    const user = getRequestUser(event);

    if (!user || !user.logged) return setResponseStatus(event, 403, 'you must be logged');

    const project_id = new Types.ObjectId(pid);

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'project not found');


    if (pid !== LITLYX_PROJECT_ID) {
        const [hasAccess, role] = await hasAccessToProject(user.id, project);
        if (!hasAccess) return setResponseStatus(event, 400, 'no access to project');
        if (role === 'GUEST' && !allowGuests) return setResponseStatus(event, 403, 'only owner can access this');
    } else {
        if (!allowLitlyx) return setResponseStatus(event, 400, 'no access to project');
    }

    return { from, to, pid, project_id, project, user, limit, slice, schemaName, model }

}