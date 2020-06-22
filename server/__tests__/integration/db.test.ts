/* eslint-disable no-undef */
import request from 'supertest';

import app from '../../src/app';
import { IUser } from '../../src/database/models';

describe('db / migration tests', () => {
  it('should return 200 ok when creating new user', async () => {
    
    const user: IUser = {
      name: 'John'
    };
    

    const response = await request(app)
      .post('/users')
      .send(user);

    console.log(response.body);

    expect(response.status).toBe(200);
  });

});
