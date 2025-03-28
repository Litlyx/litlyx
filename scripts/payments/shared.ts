
import { SharedHelper } from "../helpers/shared-helper";
import path from "node:path";

const helper = new SharedHelper(path.join(__dirname, '../../payments/src/shared'))

helper.clear();

helper.create('utils');
helper.copy('utils/requireEnv.ts');

helper.create('services');
helper.copy('services/DatabaseService.ts');
helper.copy('services/EmailService.ts');

helper.create('schema');
helper.copy('schema/UserSchema.ts');
helper.copy('schema/PremiumSchema.ts');
helper.copy('schema/UserLimitSchema.ts');

helper.create('data');
helper.copy('data/PLANS.ts');