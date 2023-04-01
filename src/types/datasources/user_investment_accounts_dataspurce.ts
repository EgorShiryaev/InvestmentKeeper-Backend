type UserDatasource = {
  getAllByUserId: (userId: number) => Promise<User | undefined>;
};

export default UserDatasource;
