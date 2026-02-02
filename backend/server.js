import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("CRM backend работает");
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Server started on port " + port));
