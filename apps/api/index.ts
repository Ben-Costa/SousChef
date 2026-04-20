import "dotenv/config";
import express from "express";
import { authRouter } from "./functions/auth";
import { copilotRouter } from "./functions/copilot";
import { ingredientsRouter } from "./functions/ingredients";
import { pantryRouter } from "./functions/pantry";
import { recipesRouter } from "./functions/recipes";
import { errorHandler } from "./middleware/error-handler";

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/copilot", copilotRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/pantry", pantryRouter);
app.use("/recipes", recipesRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.warn(`API listening on port ${port}`);
});