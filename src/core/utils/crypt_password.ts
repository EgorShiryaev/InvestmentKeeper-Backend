import bcrypt from 'bcrypt';

const saltRounds = 10;

export const encodePassword = (password: string): Promise<string> => {
  return bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      return hash;
    });
};

type Params = {
  password: string;
  hash: string;
};

export const compareEncodedPassword = ({
  password,
  hash,
}: Params): Promise<boolean> => {
  return bcrypt.compare(password, hash).then((isCompared) => {
    return isCompared;
  });
};

