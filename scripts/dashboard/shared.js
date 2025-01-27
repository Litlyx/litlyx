const path = require('path');
const fs = require('fs');
const { SharedHelper } = require('../shared-helper.js');


const helper = new SharedHelper(path.join(__dirname, '../../dashboard/shared'))

helper.clear();

// TODO: Email service as external repo

helper.create('services');
helper.copy('services/DateService.ts');


helper.create('data');
helper.copy('data/PREMIUM.ts');
helper.copy('data/ADMINS.ts');

helper.create('data/broker');
helper.copy('data/broker/Limits.ts');

helper.copyFolder('schema');