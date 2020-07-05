import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import router from './router';

dotenv.config();

class App {
  app: Application;


  constructor() {
    this.app = express();
    this.middlewares();
    this.security();
    this.router();
    this.uploads();
  }

  middlewares() {
    this.app.use(express.json());
  }

  security() {
    this.app.use(cors());
  }

  uploads() {
    this.app.use('/uploads', express.static(
      path.resolve(__dirname, '..', 'uploads')
    ));
  }

  router() {
    this.app.use(router);
    // if(process.env.NODE_ENV === 'test') this.express.use(testRoutes);
  }



}


export default new App().app;
