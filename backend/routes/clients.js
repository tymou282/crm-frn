import express from "express";
import { db } from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const result = await db.query("SELECT * FROM clients ORDER BY id DESC");
  res.json(result.rows);
});

router.post("/", verifyToken, async (req, res) => {
  const { name, phone, email, company, notes } = req.body;
  await db.query(
    "INSERT INTO clients (name, phone, email, company, notes) VALUES ($1, $2, $3, $4, $5)",
    [name, phone, email, company, notes]
  );
  res.json({ message: "Client added" });
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM clients WHERE id=$1", [id]);
  res.json({ message: "Client deleted" });
});

export default router;
