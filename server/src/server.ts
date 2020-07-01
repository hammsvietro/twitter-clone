import dotenv from 'dotenv';

import app from './app';

dotenv.config();

app.listen(process.env.SV_PORT, () => {
  console.log(`listening at: ${process.env.SV_ADDRESS}:${process.env.SV_PORT}`);
  return process.env.SV_PORT;
});
