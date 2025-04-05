
import { UserLimitModel } from "@schema/UserLimitSchema";
import { AIPlugin } from "../Plugin";
import { MAX_LOG_LIMIT_PERCENT } from "@data/broker/Limits";
import { ProjectModel } from "@schema/project/ProjectSchema";
import StripeService from "~/server/services/StripeService";
import { InvoiceData } from "~/server/api/pay/invoices";

export class AiBilling extends AIPlugin<[
    'getBillingInfo',
    'getLimits',
    'getInvoices'
]> {

    constructor() {
        super({

            'getInvoices': {
                handler: async (data: { user_id: string }) => {

                    const project = await ProjectModel.findOne({ user_id: data.user_id });
                    if (!project) return { error: 'Project not found' };
                    const invoices = await StripeService.getInvoices(data.user_id);
                    if (!invoices) return [];

                    return invoices?.data.map(e => {
                        const result: InvoiceData = {
                            link: e.invoice_pdf || '',
                            id: e.number || '',
                            date: e.created * 1000,
                            status: e.status || 'NO_STATUS',
                            cost: e.amount_due
                        }
                        return result;
                    });
                },
                tool: {
                    type: 'function',
                    function: {
                        name: 'getInvoices',
                        description: 'Gets the invoices of the user project',
                        parameters: {}
                    }
                }
            },

            'getBillingInfo': {
                handler: async (data: { user_id: string }) => {

                    return { error: 'NOT IMPLEMENTED YET' }
                    // if (project.subscription_id === 'onetime') {

                    //     const projectLimits = await ProjectLimitModel.findOne({ project_id: data.project_id });
                    //     if (!projectLimits) return { error: 'Limits not found' }

                    //     const result = {
                    //         premium: project.premium,
                    //         premium_type: project.premium_type,
                    //         billing_start_at: projectLimits.billing_start_at,
                    //         billing_expire_at: projectLimits.billing_expire_at,
                    //         limit: projectLimits.limit,
                    //         count: projectLimits.events + projectLimits.visits,
                    //         subscription_status: StripeService.isDisabled() ? 'Disabled mode' : ('One time payment')
                    //     }

                    //     return result;
                    // }

                    // const subscription = await StripeService.getSubscription(project.subscription_id);

                    // const projectLimits = await ProjectLimitModel.findOne({ project_id: data.project_id });
                    // if (!projectLimits) return { error: 'Limits not found' }


                    // const result = {
                    //     premium: project.premium,
                    //     premium_type: project.premium_type,
                    //     billing_start_at: projectLimits.billing_start_at,
                    //     billing_expire_at: projectLimits.billing_expire_at,
                    //     limit: projectLimits.limit,
                    //     count: projectLimits.events + projectLimits.visits,
                    //     subscription_status: StripeService.isDisabled() ? 'Disabled mode' : (subscription?.status ?? '?')
                    // }

                    // return result;
                },
                tool: {
                    type: 'function',
                    function: {
                        name: 'getBillingInfo',
                        description: 'Gets the informations about the billing of the user project, limits, count, subscription_status, is premium, premium type, billing start at, billing expire at',
                        parameters: {}
                    }
                }
            },

            'getLimits': {
                handler: async (data: { project_id: string }) => {
                    return { error: 'NOT IMPLEMENTED YET' }
                    // const projectLimits = await ProjectLimitModel.findOne({ project_id: data.project_id });
                    // if (!projectLimits) return { error: 'Project limits not found' };
                    // const TOTAL_COUNT = projectLimits.events + projectLimits.visits;
                    // const COUNT_LIMIT = projectLimits.limit;
                    // return {
                    //     total: TOTAL_COUNT,
                    //     limit: COUNT_LIMIT,
                    //     limited: TOTAL_COUNT > COUNT_LIMIT * MAX_LOG_LIMIT_PERCENT,
                    //     percent: Math.round(100 / COUNT_LIMIT * TOTAL_COUNT)
                    // }
                },
                tool: {
                    type: 'function',
                    function: {
                        name: 'getLimits',
                        description: 'Gets the informations about the limits of the user project',
                        parameters: {}
                    }
                }
            },


        })
    }
}

export const AiBillingInstance = new AiBilling();