import bcrypt from 'bcrypt';

const saltRounds = 10;

export const encodePassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

