

import { AppsumoCodeModel } from '@schema/AppsumoCodeSchema';
import { AppsumoCodeTryModel } from '@schema/appsumo/AppsumoCodeTrySchema';


export async function canTryAppsumoCode(project_id: string) {
    const tries = await AppsumoCodeTryModel.findOne({ project_id });
    if (!tries) return true;
    if (tries.codes.length >= 30) return false;
    return true;
}

export async function useTryAppsumoCode(project_id: string, code: string) {
    await AppsumoCodeTryModel.updateOne({ project_id }, { $push: { codes: code } }, { upsert: true });
}

export async function checkAppsumoCode(code: string) {
    const target = await AppsumoCodeModel.exists({ code, used_at: { $exists: false } });
    return target;
}

export async function useAppsumoCode(project_id: string, code: string) {
    await AppsumoCodeTryModel.updateOne({ project_id }, { $push: { valid_codes: code } }, { upsert: true });
    await AppsumoCodeModel.updateOne({ code }, { used_at: Date.now() });
}