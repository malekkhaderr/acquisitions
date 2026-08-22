import logger from '../config/logger.js';
import { signupSchema, signinSchema } from '../validations/auth.validation.js';
import { formatValidationErrors } from '../utils/format.js';
import { createUser, authenticateUser } from '../services/auth.service.js';
import { jwttoken } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';
export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = formatValidationErrors(validationResult.error);
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    //AUTH SUCCESS
    const newUser = await createUser({ name, email, password, role });
    const jwtToken = jwttoken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    cookies.set(res, 'token', jwtToken);

    logger.info(`User ${email} signed up successfully with role ${role}`);
    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    logger.error('Error during signup', e);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = formatValidationErrors(validationResult.error);
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User ${email} signed in successfully`);

    return res.status(200).json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error during sign in', error);
    next(error);
  }
};
