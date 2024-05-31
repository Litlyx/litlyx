import express from 'express';
import cors from 'cors';

import { requireEnv } from '../../shared/utilts/requireEnv';
import { connectDatabase } from '@services/DatabaseService';

const app = express();
app.use(cors());

connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));

import HealthRouter from './routes/HealthRouter';
app.use('/health', HealthRouter);
import V1Router from './routes/v1/Router';
app.use('/v1', V1Router);

app.listen(requireEnv('PORT'), () => console.log(`Listening on port ${requireEnv('PORT')}`));
