import { Schema, model } from "mongoose";
import { User } from '../types/type';
import { Types } from "mongoose";


// Create userSchema
const userSchema = new Schema<User>({
    _id: Types.ObjectId,
    
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },

    role: {
        type: String,
        required: true,
        trim: true
    },

    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
});

export const UserModel = model<User>('User', userSchema);

// Get user by username
export const getUserByUsername = (username: string) => UserModel.findOne({ username });
// Get user by session token
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ "authentication.sessionToken": sessionToken });
// Get user by id
export const getUserById = (id: string) => UserModel.findById(id);
