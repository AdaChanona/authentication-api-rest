import express from "express";

import { deleteUserById, getUserById, getUsers, updateUserById } from "../db/users";

export const getAllUsers = async (req:express.Request, res:express.Response) =>{
    try {
        const users = await getUsers();
        
        return res.status(200).json(users);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req:express.Request, res:express.Response) =>{
    try {
        const {id} = req.params;

        await deleteUserById(id);

        return res.status(200).json({"Success": "true"}).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const updateUser= async (req:express.Request, res:express.Response) =>{
    try {
        const {username} = req.body;
        const {id} = req.params;
        
        if(!username) {
            return res.sendStatus(400);
        }

        const user = await getUserById(id);
        user.username = username;
        await user.save();

        return res.status(200).json({"Success": "El usuario fue actualizado"}).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}