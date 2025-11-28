
import type { EventHandlerRequest, H3Event } from 'h3'
import { Types, Schema } from 'mongoose';
import { getPlanFromId } from '~/shared/data/PLANS';
import { PremiumModel } from '~/shared/schema/PremiumSchema';
import { ProjectModel, TProject } from '~/shared/schema/project/ProjectSchema';
import { TeamMemberModel, TeamMemberRole } from '~/shared/schema/TeamMemberSchema';
import { UserModel } from '~/shared/schema/UserSchema';
import { isValidSlice, Slice } from '~/shared/services/DateService';

import type { SecureSessionData, User } from '#auth-utils';
import { ProjectShareModel } from '~/shared/schema/project/ProjectShareSchema';

export type RequestContext = {
    user_id: string,
    user_email: string,
    pid?: string,
    project_id?: Types.ObjectId,
    project?: TProject,
    domain?: string,
    from?: number,
    to?: number,
    slice?: Slice,
    limit?: number,
    role?: TeamMemberRole,
}

export function getDomainFromString(domainString?: string): string | undefined | null {
    if (domainString === '*') return undefined;
    if (!domainString) return null;
    return domainString;
}


function getRequestDomain(event: H3Event<EventHandlerRequest>) {
    const domain = getHeader(event, 'x-domain');
    return getDomainFromString(domain);
}

function getRange(event: H3Event<EventHandlerRequest>, shared?: boolean) {
    const from = getHeader(event, shared ? 'x-shared-from' : 'x-from');
    const to = getHeader(event, shared ? 'x-shared-to' : 'x-to');
    return {
        from: parseInt(from ?? ''),
        to: parseInt(to ?? '')
    }
}

function getLimit(event: H3Event<EventHandlerRequest>) {
    const limit = getHeader(event, 'x-limit');
    if (limit) {
        const limitNumber = parseInt(limit as string);
        if (!isNaN(limitNumber)) return limitNumber;
    }
}


type Permission = 'pid' | 'domain' | 'range' | 'slice' | 'limit' | 'flag:allowAnon' |
    'permission:webAnalytics' | 'permission:events' | 'permission:ai' | 'permission:domains' | 'permission:member'
    | 'admin' | 'flag:allowAnonRegistered' | 'flag:allowShare'

type PermissionFieldMap = {
    pid: { pid: string; project_id: Types.ObjectId; project: TProject, role: TeamMemberRole },
    domain: { domain: string | undefined },
    range: { from: number; to: number },
    slice: { slice: Slice },
    limit: { limit: number },
    'flag:allowShare': {},
    'flag:allowAnon': {},
    'flag:allowAnonRegistered': {},
    'permission:member': {},
    'permission:webAnalytics': {},
    'permission:events': {},
    'permission:ai': {},
    'permission:domains': {},
    'admin': {}
}

type ContextByPermissions<Permissions extends readonly Permission[]> =
    RequestContext &
    UnionToIntersection<Permissions[number] extends keyof PermissionFieldMap ? PermissionFieldMap[Permissions[number]] : never>;

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never;


function requirePermission(permissionList: Permission[]) {
    const index = permissionList.findIndex(e => e.startsWith('permission:'));
    return index != -1;
}

export async function getPlanInfoFromUserId(user_id: string) {
    const premiumData = await PremiumModel.findOne({ user_id }, { premium_type: 1 });
    if (!premiumData) return;
    const plan = getPlanFromId(premiumData.premium_type);
    return plan;
}

async function getSharedRequestContext<Permissions extends Permission[]>(event: H3Event<EventHandlerRequest>, sharedLink: string): Promise<ContextByPermissions<Permissions>> {

    const limit = getLimit(event);

    const { from, to } = getRange(event, true);
    const slice = getHeader(event, 'x-shared-slice') as Slice | undefined;

    const result: RequestContext = {
        user_email: 'shared',
        user_id: 'shared',
        from, to, slice, limit
    }

    const sharedData = await ProjectShareModel.findOne({ link: sharedLink });
    if (!sharedData) throw createError({ status: 400, message: 'Shared link is not valid.' });

    const sharedProjectTarget = await ProjectModel.findOne({ _id: sharedData.project_id }, { owner: 1 });
    if (!sharedProjectTarget) throw createError({ status: 400, message: 'Shared link is not valid.' });
    const sharedUserPremiumTarget = await PremiumModel.findOne({ user_id: sharedProjectTarget.owner }, { premium_type: 1 });
    if (!sharedUserPremiumTarget) throw createError({ status: 400, message: 'Shared link is not valid.' });
    if (sharedUserPremiumTarget.premium_type === 7999) throw createError({ status: 400, message: 'Shared link is not valid.' });

    if (sharedData.password && sharedData.password.length > 0) {
        const password = getHeader(event, 'x-shared-pass');
        if (!password) throw createError({ status: 403, message: 'Password invalid' })
        if (sharedData.password !== password.toString()) throw createError({ status: 403, message: 'Password invalid' })
    }

    result.project_id = new Types.ObjectId(sharedData.project_id.toString());
    result.domain = getDomainFromString(sharedData.domain) as any;

    return result as ContextByPermissions<Permissions>;
}

export async function getRequestContext<Permissions extends Permission[]>(event: H3Event<EventHandlerRequest>, ...permissionList: Permissions): Promise<ContextByPermissions<Permissions>> {

    const anonAccess = permissionList.includes('flag:allowAnon');
    if (anonAccess) return { user_email: '', user_id: '' } as ContextByPermissions<Permissions>;

    const shareAccess = permissionList.includes('flag:allowShare');
    if (shareAccess) {
        const sharedLink = getHeader(event, 'x-shared-link');
        if (sharedLink) return await getSharedRequestContext(event, sharedLink);
    }

    const { secure, user } = await requireUserSession(event)
    if (!secure) throw createError({ status: 500, message: 'Internal error (secure is undefined)' });

    const userExist = await UserModel.exists({ _id: secure.user_id });
    if (!userExist) throw createError({ status: 500, message: 'User does not exists' });

    const anonAccessRegistered = permissionList.includes('flag:allowAnonRegistered');
    if (anonAccessRegistered) return { user_email: user.email, user_id: secure.user_id } as ContextByPermissions<Permissions>;

    if (permissionList.includes('admin')) {
        //TODO: Create admin list
        if (user.email != 'helplitlyx@gmail.com') throw createError({ status: 403, message: 'Admin only' })
    }

    const result: RequestContext = { user_id: secure.user_id, user_email: user.email }

    const domain = getRequestDomain(event);
    if (permissionList.includes('domain')) {
        if (domain === null) throw createError({ status: 400, message: 'x-domain is required' });
        result.domain = domain;
    }

    if (requirePermission(permissionList) && !permissionList.includes('pid')) {
        throw createError({ status: 400, message: 'pid permission missing in the endpoint' })
    }

    const pid = getHeader(event, 'x-pid');
    if (permissionList.includes('pid')) {
        if (!pid) throw createError({ status: 400, message: 'x-pid is required' });
        const project_id = new Types.ObjectId(pid);
        const project = await ProjectModel.findById(project_id);
        if (!project) throw createError({ status: 400, message: 'project not found' });
        result.pid = pid;
        result.project_id = project_id;
        result.project = project;

        if (project.owner.toString() == secure.user_id) {
            //TODO: Create admin list
            result.role = 'OWNER';

        } else {

            if (user.email === 'helplitlyx@gmail.com') {
                result.role = 'OWNER';
            } else {

                if (!permissionList.includes('flag:allowAnon') && !permissionList.includes('flag:allowAnonRegistered') && !requirePermission(permissionList)) throw createError({ status: 403, message: 'no access to this project' });


                const member = await TeamMemberModel.findOne({
                    project_id,
                    $or: [
                        { user_id: secure.user_id },
                        { email: user.email }
                    ]
                });
                if (!member) throw createError({ status: 403, message: 'no access to this project' });

                if (permissionList.includes('permission:webAnalytics')) {
                    if (!member.permission.webAnalytics) throw createError({ status: 403, message: 'webAnalytics permission required' });
                }

                if (permissionList.includes('permission:events')) {
                    if (!member.permission.events) throw createError({ status: 403, message: 'events permission required' });
                }

                if (permissionList.includes('permission:ai')) {
                    if (!member.permission.ai) throw createError({ status: 403, message: 'ai permission required' });
                }

                if (permissionList.includes('permission:domains')) {
                    if (!permissionList.includes('domain')) throw createError({ status: 403, message: 'domain permission missing in the endpoint' });
                    if (member.permission.domains.length == 0) throw createError({ status: 403, message: 'ai permission required' });

                    if (typeof domain === 'string') {
                        if (!member.permission.domains.includes(domain)) throw createError({ status: 403, message: 'domain permission required' });
                    } else {
                        if (!member.permission.domains.includes('*')) throw createError({ status: 403, message: 'all domains permission required' });
                    }

                }

                result.role = member.role;

            }


        }


    }


    const { from, to } = getRange(event);
    if (permissionList.includes('range')) {
        if (!from) throw createError({ status: 400, message: 'x-from is required' });
        if (!to) throw createError({ status: 400, message: 'x-to is required' });
        if (isNaN(from)) throw createError({ status: 400, message: 'x-from not valid' });
        if (isNaN(to)) throw createError({ status: 400, message: 'x-to not valid' });
        result.from = from;
        result.to = to;
    }

    const slice = getHeader(event, 'x-slice') as Slice | undefined;
    if (permissionList.includes('slice')) {
        if (!slice) throw createError({ status: 400, message: 'x-slice is required' });
        isValidSlice(slice);
        result.slice = slice;
    }

    const limit = getLimit(event);
    if (permissionList.includes('limit')) {
        if (!limit) throw createError({ status: 400, message: 'x-limit is required' });
        result.limit = limit;
    }

    return result as ContextByPermissions<Permissions>;

}