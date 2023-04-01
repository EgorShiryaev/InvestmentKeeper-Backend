type UserDatasource = {
  getByEmail: (email: string) => Promise<User | undefined>;
};

export default UserDatasource;
