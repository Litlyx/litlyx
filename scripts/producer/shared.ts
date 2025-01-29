
import { SharedHelper } from "../helpers/shared-helper";
import path from "node:path";

const helper = new SharedHelper(path.join(__dirname, '../../producer/src/shared'))

helper.clear();

helper.create('utils');
helper.copy('utils/requireEnv.ts');

helper.create('services');
helper.copy('services/RedisStreamService.ts');
