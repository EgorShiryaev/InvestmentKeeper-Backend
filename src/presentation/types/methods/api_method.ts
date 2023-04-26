import { Request, Response } from 'express';

type ApiMethod = {
  handler: (request: Request, response: Response) => void;
};

export default ApiMethod;

