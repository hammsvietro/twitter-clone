import dotenv from 'dotenv';

import app from './app';

dotenv.config();

app.listen(process.env.SV_PORT, () => process.env.SV_ADDRESS);
