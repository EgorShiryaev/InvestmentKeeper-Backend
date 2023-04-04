import { IncomingHttpHeaders } from 'http';

const getAuthToken = (headers: IncomingHttpHeaders): string | null => {
  const authHeader = headers['authorization'];
  if (authHeader) {
    const auth = authHeader.split(' ');
    const authToken = auth[1];
    return authToken;
  }
  return null;
};

export default getAuthToken;