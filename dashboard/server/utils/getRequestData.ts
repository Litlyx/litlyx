import type { AuthContext } from "../middleware/01-authorization";
import type { EventHandlerRequest, H3Event } from 'h3'
import { allowedModels, TModelName } from "../services/DataService";
import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { Model, Types } from "mongoose";
import { TeamMemberModel } from "@schema/TeamMemberSchema";
import { Slice } from "@services/DateService";
import { ADMIN_EMAILS } from "~/shared/data/ADMINS";

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
    /** @default false */ requireOffset?: boolean,
}

export type RequestDataScope = 'GUEST' | 'SCHEMA' | 'ANON' | 'SLICE' | 'RANGE' | 'OFFSET' | 'DOMAIN';

async function hasAccessToProject(user_id: string, project: TProject) {
    if (!project) return [false, 'NONE'];
    const owner = project.owner.toString();
    const project_id = project._id;
    if (owner === user_id) return [true, 'OWNER'];
    const isGuest = await TeamMemberModel.exists({ project_id, user_id });
    if (isGuest) return [true, 'GUEST'];

    //TODO: Create table with admins
    if (user_id === '66520c90f381ec1e9284938b') return [true, 'ADMIN'];

    return [false, 'NONE'];
}

export async function getRequestData(event: H3Event<EventHandlerRequest>, required_scopes: RequestDataScope[] = []) {

    const requireSchema = required_scopes.includes('SCHEMA');
    const allowGuests = required_scopes.includes('GUEST');
    const allowAnon = required_scopes.includes('ANON');
    const requireSlice = required_scopes.includes('SLICE');
    const requireRange = required_scopes.includes('RANGE');
    const requireOffset = required_scopes.includes('OFFSET');
    const requireDomain = required_scopes.includes('DOMAIN');

    const pid = getHeader(event, 'x-pid');
    if (!pid) return setResponseStatus(event, 400, 'x-pid is required');

    let domain: any = getHeader(event, 'x-domain');
    if (requireDomain) {
        if (domain == null || domain == undefined || domain.length == 0) return setResponseStatus(event, 400, 'x-domain is required');
    }
    if (domain === 'ALL DOMAINS') {
        domain = { $ne: '_NODOMAIN_' }
    }

    const slice = getHeader(event, 'x-slice') as Slice;
    if (!slice && requireSlice) return setResponseStatus(event, 400, 'x-slice is required');

    const from = getRequestHeader(event, 'x-from');
    const to = getRequestHeader(event, 'x-to');
    if (requireRange) {
        if (!from || !to) return setResponseStatus(event, 400, 'x-from and x-to are required');
    }

    const offsetRaw = getRequestHeader(event, 'x-time-offset');
    const offset = parseInt(offsetRaw?.toString() as string);
    if (requireOffset) {
        if (offset === null || offset === undefined || isNaN(offset)) return setResponseStatus(event, 400, 'x-time-offset is required');
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

    if (!allowAnon) {
        const [hasAccess, role] = await hasAccessToProject(user.id, project);
        if (!hasAccess) return setResponseStatus(event, 400, 'no access to project');
        if (role === 'GUEST' && !allowGuests) return setResponseStatus(event, 403, 'only owner can access this');
    }

    return {
        from: from as string,
        to: to as string,
        domain: domain as string,
        pid, project_id, project, user, limit, slice, schemaName, model, timeOffset: offset
    }
}

/**
 * @deprecated - use getRequestData instead
 */
export async function getRequestDataOld(event: H3Event<EventHandlerRequest>, options?: GetRequestDataOptions) {

    const requireSchema = options?.requireSchema || false;
    const allowGuests = options?.allowGuests || true;
    const allowLitlyx = options?.allowLitlyx || true;
    const requireSlice = options?.requireSlice || false;
    const requireRange = options?.requireRange || false;
    const requireOffset = options?.requireOffset || false;

    const pid = getHeader(event, 'x-pid');
    if (!pid) return setResponseStatus(event, 400, 'x-pid is required');

    const slice = getHeader(event, 'x-slice') as Slice;
    if (!slice && requireSlice) return setResponseStatus(event, 400, 'x-slice is required');

    const from = getRequestHeader(event, 'x-from');
    const to = getRequestHeader(event, 'x-to');
    if (requireRange) {
        if (!from || !to) return setResponseStatus(event, 400, 'x-from and x-to are required');
    }

    const offsetRaw = getRequestHeader(event, 'x-time-offset');
    const offset = parseInt(offsetRaw?.toString() as string);
    if (requireOffset) {
        if (offset === null || offset === undefined || isNaN(offset)) return setResponseStatus(event, 400, 'x-time-offset is required');
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


    if (pid !== "6643cd08a1854e3b81722ab5") {
        const [hasAccess, role] = await hasAccessToProject(user.id, project);
        if (!hasAccess) return setResponseStatus(event, 400, 'no access to project');
        if (role === 'GUEST' && !allowGuests) return setResponseStatus(event, 403, 'only owner can access this');
    } else {
        if (!allowLitlyx) return setResponseStatus(event, 400, 'no access to project');
    }

    return {
        from: from as string,
        to: to as string,
        pid, project_id, project, user, limit, slice, schemaName, model, timeOffset: offset
    }

}