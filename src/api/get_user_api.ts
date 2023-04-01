import Api from "../types/api";
import UserRepository from "../types/repositories/user_repository";

type Params = {
  repository: UserRepository;
};

const GetUserApi = ({ repository }: Params): Api => {
  return {
    handler: (request, response) => {},
  };
};

export default GetUserApi;
