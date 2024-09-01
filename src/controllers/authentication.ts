import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";

//Controlador de registro de usuarios
export const register = async (req: express.Request, res: express.Response) =>{
    try {
        const {email,password, username} = req.body;

        //Verificamos si estan los datos que se necesitan y si existe el usuario
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }

        //Si pasa los filtros proseguimos con la autenticación y registro
        const salt = random();

        const user = await createUser({
            username,
            email,
            authentication:{
                password: authentication(salt,password),
                salt,
            }
        })

        return res.status(200).json(user).end();
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

// Controlador de inicio de sesión

export const login = async (req:express.Request, res:express.Response) =>{
    try {
        const {email, password} = req.body;

        //Verificamos si estan los datos que se necesitan y si existe el usuario
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400);
        }

        //Si pasa los filtros proseguimos con la autenticación

        //Con la contraseña dada generamos un hash, despues se compara con el hash de la contraseña guardada en la BD
        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password != expectedHash) {
            return res.sendStatus(403);
        }

        //Generamos el token de sesión
        const salt = random();
        user.authentication.sessionToken = authentication(salt,user._id.toString());
        await user.save();

        //Guardamos el token en las cookies
        res.cookie('AUTH-SESSION-TOKEN', user.authentication.sessionToken, {domain: 'localhost', path: '/'});

        return res.status(200).json({
            "sucess": "true",
            "token": user.authentication.sessionToken
        }).end();


        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }

}