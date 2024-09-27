

import type { TSupabaseIntegration } from "@schema/integrations/SupabaseIntegrationSchema";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { format } from 'date-fns';

const activeProjectId = useActiveProjectId();


const computedHeaders = computed<Record<string, string>>(() => {
    const signedHeaders = signHeaders();
    return {
        'x-pid': activeProjectId.data.value || '',
        'Authorization': signedHeaders.headers.Authorization
    }
})

const integrationsCredentials = useFetch(`/api/integrations/credentials/get`, {
    headers: computedHeaders,
    onResponse: (e) => {
        supabaseUrl.value = e.response._data.supabase.url || '';
        supabaseAnonKey.value = e.response._data.supabase.anon_key || '';
        supabaseServiceRoleKey.value = e.response._data.supabase.service_role_key || '';
    }
});

const supabaseUrl = ref<string>('');
const supabaseAnonKey = ref<string>('');
const supabaseServiceRoleKey = ref<string>('');

const supabaseIntegrations = useFetch<TSupabaseIntegration[]>('/api/integrations/supabase/list', { headers: computedHeaders })


const subabaseClientData: { client: SupabaseClient | undefined } = {
    client: undefined
}

async function updateIntegrationsCredentails(data: { supabase_url: string, supabase_anon_key: string, supabase_service_role_key: string }) {
    try {
        await $fetch(`/api/integrations/credentials/${activeProjectId.data.value}/update`, {
            ...signHeaders({ 'Content-Type': 'application/json' }),
            method: 'POST',
            body: JSON.stringify({
                supabase_url: data.supabase_url,
                supabase_anon_key: data.supabase_anon_key,
                supabase_service_role_key: data.supabase_service_role_key
            }),
        });
        integrationsCredentials.refresh();
        return { ok: true, error: '' }
    } catch (ex: any) {
        return { ok: false, error: ex.message.toString() };
    }

}

function createSupabaseUrl(supabaseUrl: string) {
    let result = supabaseUrl;
    if (!result.includes('https://')) result = `https://${result}`;
    if (!result.endsWith('.supabase.co')) result = `${result}.supabase.co`;
    return result;
}


async function testConnection() {
    const url = createSupabaseUrl(supabaseUrl.value);    
    subabaseClientData.client = createClient(url, supabaseAnonKey.value);
    const res = await subabaseClientData.client.from('_t_e_s_t_').select('*').limit(1);
    if (res.error?.message.startsWith('TypeError')) return false;
    return true;
}



type GroupBy = 'day' | 'month';

const groupByDate = (data: string[], groupBy: GroupBy) => {
    return data.reduce((acc, item) => {
        const date = new Date(item);
        const dateKey = groupBy === 'day'
            ? format(date, 'yyyy-MM-dd') // Group by day
            : format(date, 'yyyy-MM');    // Group by month

        if (!acc[dateKey]) { acc[dateKey] = []; }

        acc[dateKey].push(item);
        return acc;
    }, {} as Record<string, string[]>);
}

async function getRemoteData(table: string, xField: string, yMode: string, from: string, to: string, slice: string) {
    const url = createSupabaseUrl(supabaseUrl.value);
    subabaseClientData.client = createClient(url, supabaseAnonKey.value);
    const res = await subabaseClientData.client.from(table).select(xField)
        .filter(xField, 'gte', from)
        .filter(xField, 'lte', to);

    if (res.error) return { error: res.error.message };

    const grouped = groupByDate(res.data.map((e: any) => e.created_at) || [], slice as any);

    const result: { labels: string[], data: number[] } = { labels: [], data: [] }

    for (const key in grouped) {
        result.labels.push(key);
        result.data.push(grouped[key].length);
    }


    return { result };
}

export function useSupabase() {

    return {
        getRemoteData,
        testConnection,
        supabaseIntegrations, integrationsCredentials,
        supabaseUrl, supabaseAnonKey,
        supabaseServiceRoleKey,
        updateIntegrationsCredentails
    }

}