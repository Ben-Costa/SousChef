import { Router } from "express";

export const ingredientsRouter = Router();

ingredientsRouter.get("/", (_request, response) => {
  response.json({ items: [] });
});