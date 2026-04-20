import { Router } from "express";

export const authRouter = Router();

authRouter.get("/session", (_request, response) => {
  response.json({ authenticated: false });
});