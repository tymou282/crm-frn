import express from "express";
import { db } from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const tasks = await db.query("SELECT * FROM tasks ORDER BY id DESC");
  res.json(tasks.rows);
});

router.post("/", verifyToken, async (req, res) => {
  const { title, description, status, assigned_to, due_date } = req.body;
  await db.query(
    "INSERT INTO tasks (title, description, status, assigned_to, due_date) VALUES ($1,$2,$3,$4,$5)",
    [title, description, status, assigned_to, due_date]
  );
  res.json({ message: "Task created" });
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM tasks WHERE id=$1", [id]);
  res.json({ message: "Task deleted" });
});

export default router;
