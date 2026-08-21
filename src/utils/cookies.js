export const cookies = {
  getoptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict', // Adjust based on your requirements
    maxAge: 15 * 60 * 1000, // 15m  in milliseconds
  }),
  set: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookies.getoptions(), ...options });
  },
  clear: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookies.getoptions(), ...options });
  },
  get: (req, name) => {
    return req.cookies[name];
  },
};
