type UserRepository = {
  getByEmail: (email: string) => Promise<User>;
};

export default UserRepository;
