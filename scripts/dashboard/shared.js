const path = require('path');
const fs = require('fs');
const { SharedHelper } = require('../shared-helper.js');


const helper = new SharedHelper(path.join(__dirname, '../../dashboard/shared'))

helper.clear();

// TODO: Email service as external repo

helper.create('services');


// // ---------------- Services ----------------
// const dashServicesPath = path.join(dashboardPath, 'shared/services');
// const sharedServicesPath = path.join(sharedPath, 'services');

// if (fs.existsSync(dashServicesPath)) {
//     fs.rmSync(dashServicesPath, { force: true, recursive: true });
//     fs.mkdirSync(dashServicesPath);
// }

// // DateService
// const dashDateServicePath = path.join(dashServicesPath, 'DateService.ts');
// const sharedDateServicePath = path.join(sharedServicesPath, 'DateService.ts');
// fs.cpSync(sharedDateServicePath, dashDateServicePath);


// // ---------------- Data ----------------

// const dashDataPath = path.join(dashboardPath, 'shared/data');
// const sharedDataPath = path.join(sharedPath, 'data');

// if (fs.existsSync(dashDataPath)) {
//     fs.rmSync(dashDataPath, { force: true, recursive: true });
//     fs.mkdirSync(dashDataPath);
// }

// // Premium
// const dashPremiumDataPath = path.join(dashDataPath, 'PREMIUM.ts');
// const sharedPremiumDataPath = path.join(sharedDataPath, 'PREMIUM.ts');
// fs.cpSync(sharedPremiumDataPath, dashPremiumDataPath);

// // Admins
// const dashAdminsDataPath = path.join(dashDataPath, 'ADMINS.ts');
// const sharedAdminsDataPath = path.join(sharedDataPath, 'ADMINS.ts');
// fs.cpSync(sharedAdminsDataPath, dashAdminsDataPath);

// // BrokerLimits
// const dashBrokerLimitsDataPath = path.join(dashDataPath, 'broker/Limits.ts');
// const sharedBrokerLimitsDataPath = path.join(sharedDataPath, 'broker/Limits.ts');
// fs.cpSync(sharedBrokerLimitsDataPath, dashBrokerLimitsDataPath);



// // ---------------- Schema ----------------

// const dashSchemaPath = path.join(dashboardPath, 'shared/schema');
// const sharedSchemaPath = path.join(sharedPath, 'schema');

// if (fs.existsSync(dashSchemaPath)) {
//     fs.rmSync(dashSchemaPath, { force: true, recursive: true });
//     fs.mkdirSync(dashSchemaPath);
// }

// fs.cpSync(sharedSchemaPath, dashSchemaPath, { recursive: true });