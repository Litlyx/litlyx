import { SharedHelper } from "../helpers/shared-helper";
import path from "node:path";

const helper = new SharedHelper(path.join(__dirname, '../../dashboard/shared'))

helper.clear();

helper.create('services');
helper.copy('services/DateService.ts');

helper.create('data');
helper.copy('data/PLANS.ts');
helper.copy('data/ADMINS.ts');

helper.create('data/broker');
helper.copy('data/broker/Limits.ts');

helper.copyFolder('schema');