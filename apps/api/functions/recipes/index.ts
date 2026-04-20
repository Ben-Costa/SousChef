import { Router } from "express";

export const recipesRouter = Router();

recipesRouter.get("/", (_request, response) => {
  response.json({ recipes: [] });
});