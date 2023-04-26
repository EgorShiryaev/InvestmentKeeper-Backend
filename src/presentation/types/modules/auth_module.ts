import ApiMethod from '../methods/api_method';

type AuthModule = {
  isUser: ApiMethod;
  login: ApiMethod;
  registration: ApiMethod;
};

export default AuthModule;
