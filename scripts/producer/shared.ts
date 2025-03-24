
import { SharedHelper } from "../helpers/shared-helper";
import path from "node:path";

const helper = new SharedHelper(path.join(__dirname, '../../producer/src/shared'))

helper.clear();

helper.create('utils');
helper.copy('utils/requireEnv.ts');

helper.create('services');
helper.copy('services/RedisStreamService.ts');
helper.copy('services/DatabaseService.ts');

helper.create('schema');
helper.create('schema/shields');
helper.copy('schema/shields/AddressBlacklistSchema.ts');
helper.copy('schema/shields/BotTrafficOptionSchema.ts');
helper.copy('schema/shields/CountryBlacklistSchema.ts');
helper.copy('schema/shields/DomainWhitelistSchema.ts');
helper.copy('schema/shields/PageBlacklistSchema.ts');
