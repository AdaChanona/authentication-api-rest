//Este código sirve para cifrar la contraseña o crear un token aleatorio para la autenticación

import crypto from 'crypto';
import { env } from "../env";

const SECRET = env.SECRET;

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt:string, password:string) =>{
    return crypto.createHmac('sha256', [salt , password].join('/')).update(SECRET).digest('hex');
}