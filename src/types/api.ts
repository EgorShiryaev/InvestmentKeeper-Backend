import { Request, Response } from "express";

type Api = {
  handler: (request: Request, response: Response) => void;
};

export default Api;
