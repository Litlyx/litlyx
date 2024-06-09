import express from 'express';
import cors from 'cors';

import { requireEnv } from '../../shared/utilts/requireEnv';
import { connectDatabase } from '@services/DatabaseService';
import { startStreamLoop } from './StreamLoopController';

const app = express();
app.use(cors());

connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));

import HealthRouter from './routes/HealthRouter';
app.use('/health', HealthRouter);

app.listen(requireEnv('PORT'), () => console.log(`Listening on port ${requireEnv('PORT')}`));

startStreamLoop();
