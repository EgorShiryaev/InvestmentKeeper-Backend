import ApiMethod from '../../api/api';

type AuthModule = {
  isUser: ApiMethod;
  login: ApiMethod;
  registration: ApiMethod;
};

export default AuthModule;

