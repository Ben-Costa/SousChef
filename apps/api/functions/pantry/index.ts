import { Router } from "express";

export const pantryRouter = Router();

pantryRouter.get("/", (_request, response) => {
  response.json({ pantry: [] });
});