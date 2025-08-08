import express from "express";
import { User } from '../types/type';
import { getUserByUsername, getUserById } from '../models/user';
import { createUser, authenticateUser, updateSessionToken, extractSessionToken, clearSessionToken } from '../middleware/auth';

const req = express.request;
const res = express.response;

// Get user by username
export const retrieveUserByUsername = async () => {
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
export const retrieveUserById = async () => {
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
export const registerUser = async ()=> {
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

// Login user
export const loginUser = async (sessionToken: string)=> {
    try {
        // get password, username
        const { username, password } = req.body;

        // Return status 400 if password, username is not exist
        if (!username && !password) {
            res.sendStatus(400);
            return;
        }

        // Authenticate user credentials
        const user: User | null = await authenticateUser(username, password);
        if (user) {
            if (sessionToken) {
                // Get user id
                const userId: string = user._id.toString();

                // Update session token of user
                const isUpdate: boolean = await updateSessionToken(userId, sessionToken);

                if (!isUpdate) {
                    console.log("Update session token failed.");
                    res.sendStatus(400);
                    return;
                }
                // Login successfully then return user json
                console.log("Login successfully!");
                res.status(200).json(user);
                return;
            }
        }
        else {
            // Return status 400 if user is not exist
            console.log("Authenticate user was failed. User is not exist or password is incorrect.");
            res.sendStatus(400);
            return;
        }

    // Return status 400 if login failed
    } catch (error) {
        console.log("Login failed,", error);
        res.sendStatus(400);
        return;
    }
}

// Logout user
export const logoutUser = async ()=> {
    try {
        // Get session token
        const authHeader: string | undefined = req.headers.authorization;
        const sessionToken: string | null = extractSessionToken(authHeader);

        if (sessionToken) {
            // Clear session token
            const isClearToken: boolean = await clearSessionToken(sessionToken);

            if (isClearToken) {
                console.log("Clear session token successfully.");
                res.sendStatus(200);
                return
            }
            else{
                console.log("Clear session token failed.");
                res.sendStatus(400); 
                return;
            }
        }
        else {
            // Return status 400 if userId is not exist
            console.log("Session token is not provided for logout.");
            res.sendStatus(400);
            return;
        }
    
    // Return status 400 if logout user fail
    } catch (error) {
        console.log("Logout failed,", error);
        res.sendStatus(400);
        return;
    }
}