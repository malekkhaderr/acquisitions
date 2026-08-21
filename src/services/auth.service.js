import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';
export const hashedPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password', error);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async ({ password, hashedPassword }) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password', error);
    throw new Error('Error comparing password');
  }
};

export const userExisted = async email => {
  try {
    return await db.select().from(users).where(eq(users.email, email)).limit(1);
  } catch (error) {
    logger.error('Error when searching for existing user', error);
    throw new Error('Error when searching for existing user');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await userExisted(email);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }
    const hashedPwd = await hashedPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPwd, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });
    logger.info(`User ${email} created successfully with role ${role}`);
    return newUser;
  } catch (error) {
    logger.error('Error creating user', error);
    throw error;
  }
};

export const signIn = async ({ email, password }) => {};
