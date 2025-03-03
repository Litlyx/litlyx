import type { AuthContext } from "../middleware/01-authorization";
import type { EventHandlerRequest, H3Event } from 'h3'
import { allowedModels, TModelName } from "../services/DataService";
import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { Model, Types } from "mongoose";
import { TeamMemberModel, TPermission } from "@schema/TeamMemberSchema";
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

export type RequestDataScope = 'SCHEMA' | 'ANON' | 'SLICE' | 'RANGE' | 'OFFSET' | 'DOMAIN';
export type RequestDataPermissions = 'WEB' | 'EVENTS' | 'AI' | 'OWNER';

async function getAccessPermission(user_id: string, project: TProject): Promise<TPermission> {
    if (!project) return { ai: false, domains: [], events: false, webAnalytics: false }

    //TODO: Create table with admins
    if (user_id === '66520c90f381ec1e9284938b') return { ai: true, domains: ['All domains'], events: true, webAnalytics: true }

    const owner = project.owner.toString();
    const project_id = project._id;
    if (owner === user_id) return { ai: true, domains: ['All domains'], events: true, webAnalytics: true }
    const member = await TeamMemberModel.findOne({ project_id, user_id }, { permission: 1 });
    if (!member) return { ai: false, domains: [], events: false, webAnalytics: false }
    return { ai: false, domains: [], events: false, webAnalytics: false, ...member.permission as any }
}

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

export async function getRequestData(event: H3Event<EventHandlerRequest>, required_scopes: RequestDataScope[] = [], required_permissions: RequestDataPermissions[] = []) {

    const requireSchema = required_scopes.includes('SCHEMA');
    const allowAnon = required_scopes.includes('ANON');
    const requireSlice = required_scopes.includes('SLICE');
    const requireRange = required_scopes.includes('RANGE');
    const requireOffset = required_scopes.includes('OFFSET');
    const requireDomain = required_scopes.includes('DOMAIN');

    const pid = getHeader(event, 'x-pid');
    if (!pid) return setResponseStatus(event, 400, 'x-pid is required');

    const originalDomain = getHeader(event, 'x-domain')?.toString();

    let domain: any = originalDomain;

    if (requireDomain) {
        if (domain == null || domain == undefined || domain.length == 0) return setResponseStatus(event, 400, 'x-domain is required');
    }
    if (domain === 'All domains') {
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


    if (user.id != project.owner.toString()) {
        if (required_permissions.includes('OWNER')) return setResponseStatus(event, 403, 'ADMIN permission required');
        const hasAccess = await TeamMemberModel.findOne({ project_id, user_id: user.id });
        if (!hasAccess) return setResponseStatus(event, 403, 'No permissions');
    }


    if (required_permissions.length > 0 || requireDomain) {

        const permission = await getAccessPermission(user.id, project);

        if (required_permissions.includes('WEB') && permission.webAnalytics === false) {
            return setResponseStatus(event, 403, 'WEB permission required');
        }
        if (required_permissions.includes('EVENTS') && permission.events === false) {
            return setResponseStatus(event, 403, 'EVENTS permission required');
        }
        if (required_permissions.includes('AI') && permission.ai === false) {
            return setResponseStatus(event, 403, 'AI permission required');
        }
        if (requireDomain && originalDomain) {
            if (!permission.domains.includes('All domains') && !permission.domains.includes(originalDomain)) {
                return setResponseStatus(event, 403, 'DOMAIN permission required');
            }
        }

    }

    return {
        from: from as string,
        to: to as string,
        domain: domain as string,
        originalDomain: originalDomain as string,
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