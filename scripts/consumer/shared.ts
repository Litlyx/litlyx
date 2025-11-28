
import { SharedHelper } from "../helpers/shared-helper";
import path from "node:path";

const helper = new SharedHelper(path.join(__dirname, '../../consumer/src/shared'))

helper.clear();

helper.create('utils');
helper.copy('utils/requireEnv.ts');

helper.create('services');
helper.copy('services/RedisStreamService.ts');
helper.copy('services/DatabaseService.ts');

helper.create('schema');
helper.copy('schema/UserSchema.ts');
helper.copy('schema/UserLimitSchema.ts');
helper.copy('schema/PremiumSchema.ts');

helper.create('schema/broker');
helper.copy('schema/broker/LimitNotifySchema.ts');

helper.create('schema/project');
helper.copy('schema/project/ProjectSchema.ts');
helper.copy('schema/project/ProjectsCounts.ts');

helper.create('schema/metrics');
helper.copy('schema/metrics/VisitSchema.ts');
helper.copy('schema/metrics/SessionSchema.ts');
helper.copy('schema/metrics/EventSchema.ts');

helper.create('data');
helper.create('data/broker');
helper.copy('data/broker/Limits.ts');