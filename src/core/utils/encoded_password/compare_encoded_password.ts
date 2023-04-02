import bcrypt from 'bcrypt';

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

