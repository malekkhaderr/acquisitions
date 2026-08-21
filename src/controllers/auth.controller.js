import logger from '../config/logger.js';
import { signupSchema } from '../validations/auth.validation.js';
import { formatValidationErrors } from '../utils/format.js';
import { createUser } from '../services/auth.service.js';
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
  } catch (e) {
    logger.error('Error during signup', e);

    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    next(e);
  }
};
