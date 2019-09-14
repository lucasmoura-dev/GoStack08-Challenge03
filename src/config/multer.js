import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // primeiro parâmetro é o erro. Converte 16 bytes em uma string hexadecimal
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
