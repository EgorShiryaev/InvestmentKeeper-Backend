import { IncomingHttpHeaders } from 'http';

const getAuthToken = (headers: IncomingHttpHeaders): string | undefined  => {
  const authHeader = headers['authorization'];
  if (authHeader) {
    const auth = authHeader.split(' ');
    const authToken = auth[1];
    return authToken;
  }
};

export default getAuthToken;