import { Request, Response } from "express";
import { User } from '../types/type';
import { getUserByUsername, getUserById } from '../models/user';
import { createUser } from '../middleware/auth';

// Get user by username
export const retrieveUserByUsername = async ( req: Request, res: Response ) => {
    try {
        // get username
        const { username } = req.body;

        // Return status 400 if username is not exist
        if (!username) {
            res.sendStatus(400);
            return;
        }

        // return user by username
        const user: User | null = await getUserByUsername(username);

        // Return status 400 if user is not exist
        if (!user) {
            res.sendStatus(400);
            return;
        }

        // return user
        res.status(200).json(user);
        return user;
    
    // Return status 400 if retrieve user fail
    } catch (error) {
       console.log("Retrieve user by username failed,", error);
        res.sendStatus(400);
        return;
    }
}

// Get user by id
export const retrieveUserById = async ( req: Request, res: Response ) => {
    try {
        // get id
        const { id } = req.body;

        // Return status 400 if id is not exist
        if (!id) {
            res.sendStatus(400);
            return;
        }

        // return user by id
        const user: User | null = await getUserById(id);

        // Return status 400 if user is not exist
        if (!user) {
            res.sendStatus(400);
            return;
        }

        // return user
        res.status(200).json(user);
        return user;
    
    // Return status 400 if retrieve user fail
    } catch (error) {
        console.log("Retrieve user by id failed,", error);
        res.sendStatus(400);
        return;
    }
}

// Register user
export const registerUser = async ( req: Request, res: Response )=> {
    try {
        // get password, username
        const { username, password } = req.body;

        // Return status 400 if password, username is not exist
        if (!username && !password) {
            res.sendStatus(400);
            return;
        }

        // Set user object
        const user = { username, password, role: 'admin' };

        // return user json and save user on database
        res.status(200).json(user);
        createUser(user);
        return;
    
    // Return status 400 if register user fail
    } catch (error) {
        console.log("Register user failed,", error);
        res.sendStatus(400);
        return;
    }
}