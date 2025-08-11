import { Request, Response } from "express";
import { User } from '../types/type';
import { authenticateUser, clearSessionToken, updateSessionToken } from "../middleware/auth";

// Login user
export const loginUser = async (sessionToken: string,  req: Request, res: Response )=> {
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
export const logoutUser = async ( req: Request, res: Response )=> {
    try {
        // Get session token
        const sessionToken: string | undefined = req.headers.authorization;

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
