import { Request, Response } from 'express';
import knex from '../database/config';

import { IUser } from '../database/models';

class UserController {
  async index(req: Request, res: Response) {
  
    const users = await knex('users');
    return res.status(200).send(users);
  }

  async store(req: Request, res: Response) {

    const { username, email, name, password }: IUser = req.body;
  
    const sucess = await knex('users').insert({ name, username, email, password });
  
    if(!sucess) return res.status(500).send({ error: `couldn't add ${name}, try again later` });
  
  
    return res.status(200).send({ sucess: `${name} is now registered` });

  }
}

export default new UserController();
