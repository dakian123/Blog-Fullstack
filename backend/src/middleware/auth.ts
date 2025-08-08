import crypto from 'crypto';
import { UserModel, getUserByUsername, getUserBySessionToken } from '../models/user';
import { User } from '../types/type';

// Generate secure random salt
export const generateSalt = (): string => crypto.randomBytes(128).toString('base64');

// Hash password with salt using PBKDF2
export const hashPassword = (password: string, salt: string): string => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

// Hash password for comparison (utility function)
export const comparePasswords = (inputPassword: string, salt: string, storedHash: string): boolean => {
    const inputHash = hashPassword(inputPassword, salt);
    return inputHash === storedHash;
};

// Generate and set session token for user
export const generateSessionToken = async (): Promise<string> => {
    const sessionToken = generateSalt();
    return sessionToken;
};

// Update session token for user
export const updateSessionToken = async (userId: string, sessionToken: string): Promise<boolean> => {
    if (userId) {
        await UserModel.findByIdAndUpdate(userId, {'authentication.sessionToken': sessionToken});
        return true;
    }
    return false;
};

// Extract session token from Authorization header
export const extractSessionToken = (authHeader: string | undefined): string | null => {
    if (!authHeader) {
        return null;
    }

    return authHeader;
};

// Clear session token (logout)
export const clearSessionToken = async (sessionToken: string): Promise<boolean> => {
    const user = await getUserBySessionToken(sessionToken);
    
    if (!user) {
        return false;
    }
    
    user.authentication.sessionToken = '';
    await user.save();
    
    return true;
};

// Create a new user with hashed password
export const createUser = async (values: {
    username: string;
    password: string;
    role?: string;
}): Promise<User> => {
    const { username, password, role = 'user' } = values;
    
    // Generate salt
    const salt = generateSalt();
    
    // Hash the password
    const hashedPassword = hashPassword(password, salt);
    
    // Create user with authentication data
    const user = new UserModel({
        username,
        role,
        authentication: {
            password: hashedPassword,
            salt: salt,
            sessionToken: ''
        }
    });
    
    return await user.save();
};

// Authenticate user credentials
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
    // Find user with authentication data
    const user = await UserModel.findOne({ username }).select('+authentication.password +authentication.salt');
    
    if (!user) {
        return null;
    }

    // Compare with stored hashed password
    if (!comparePasswords( password, user.authentication.salt, user.authentication.password)) {
        return null;
    }

    return user;
};

// Verify password for an existing user
export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
    // Get user with authentication data if not already included
    let userWithAuth = user;
    
    if (!user.authentication.salt || !user.authentication.password) {
        const fullUser = await UserModel.findById(user._id).select('+authentication.password +authentication.salt');
        if (!fullUser) return false;
        userWithAuth = fullUser;
    }
    
    // Hash the provided password with the stored salt
    const hashedInputPassword = hashPassword(password, userWithAuth.authentication.salt);
    
    // Compare with stored hashed password
    return hashedInputPassword === userWithAuth.authentication.password;
};

// Validate session token and return user
export const validateSessionToken = async (sessionToken: string): Promise<User | null> => {
    if (!sessionToken) {
        return null;
    }
    
    const user = await getUserBySessionToken(sessionToken);
    return user;
};

// Check if username already exists
export const isUsernameExists = async (username: string): Promise<boolean> => {
    const user = await getUserByUsername(username);
    return !!user;
};


// Get user by session token with error handling
export const getUserFromSession = async (sessionToken: string): Promise<User | null> => {
    try {
        return await getUserBySessionToken(sessionToken);
    } catch (error) {
        console.error('Error getting user from session:', error);
        return null;
    }
};

// Validate password strength (basic validation)
export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    
    if (password.length > 128) {
        return { valid: false, message: 'Password must be less than 128 characters' };
    }
    
    // Add more validation rules as needed
    // if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    //     return { valid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    // }
    
    return { valid: true };
};