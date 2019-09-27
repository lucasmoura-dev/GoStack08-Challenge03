import 'dotenv/config';
import express from 'express';
import path from 'path';
import routes from './routes';

// Não precisa informar o index, ele vai detectar automaticamente
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // Inserir arquivos estáticos como css, html etc
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    /* this.server.use(
      async(err, req, res, next => {
        if (process.env.NODE_ENV === 'development') {
        }
      })
    );
    return res.status(500).json({ error: 'Internal server error' }); */
  }
}

export default new App().server;
