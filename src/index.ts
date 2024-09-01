import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import { env } from "./env";

const app = express();

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(env.PORT, ()=>{
    console.log('Server running on http://'+env.HOST+':'+env.PORT+'/');
});

//conexión a la base de datos utilizando mongoose
mongoose.Promise = Promise;
mongoose.connect(env.MONGO_URL);
mongoose.connection.on('error',(error: Error)=> console.log(error));

app.use('/',router());