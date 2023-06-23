import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const encodePassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

