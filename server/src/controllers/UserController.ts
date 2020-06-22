import { Request, Response } from 'express';
import knex from '../database/config';

import { IUser } from '../database/models';

const index = async (req: Request, res: Response) => {
  
  const users = await knex('users');
  return res.status(200).send(users);

};

const store = async (req: Request, res: Response) => {

  const { name }: IUser = req.body;

  const sucess = await knex('users').insert({ name });

  if(!sucess) return res.status(500).send({ error: `couldn't add ${name}, try again later` });


  return res.status(200).send({ sucess: `${name} is now registered` });
};

export default {
  index,
  store,
};
