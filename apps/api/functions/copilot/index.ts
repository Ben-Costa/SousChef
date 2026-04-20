import { Router } from "express";

export const copilotRouter = Router();

copilotRouter.post("/chat", async (_request, response) => {
  response.json({ message: "Copilot endpoint scaffolded." });
});