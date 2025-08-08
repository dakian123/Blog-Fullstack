import { Document, Types } from "mongoose";

export interface News extends Document{
    _id: Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface User extends Document{
    _id: Types.ObjectId;
    username: string;
    role: string;
    authentication: {
        password: string,
        salt: string,
        sessionToken: string
    }
}
