

import { AppsumoCodeModel } from '@schema/AppsumoCode'

export async function checkAppsumoCode(code: string) {
    const target = await AppsumoCodeModel.exists({ code, used_at: { $exists: false } });
    return target;
}


export async function useAppsumoCode(code: string) {
    await AppsumoCodeModel.updateOne({ code }, { used_at: Date.now() });
}