import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser"; // json parser
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";

const PORT = 3000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Allowed headers
  })
);

app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, "storage.json");

const readJSONFile = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJSONFile = data => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

app.get("/api/data", (req, res) => {
  const data = readJSONFile();
  res.json(data);
});

app.post("/api/data-add", (req, res) => {
  const newData = req.body;
  const data = readJSONFile();
  data.push(newData);
  writeJSONFile(data);
  res.status(201).json(newData);
});

app.delete("/api/data-delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  let data;
  try {
    data = readJSONFile();
  } catch (err) {
    console.error("Error reading data from file:", err);
    return res.status(500).json({ message: "Internal server error" });
  }

  const initialLength = data.length;
  data = data.filter(item => item.id !== id);

  if (data.length === initialLength) {
    return res.status(404).json({ message: "Object not found" });
  }

  try {
    writeJSONFile(data);
  } catch (err) {
    console.error("Error writing data to file:", err);
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(200).json({ message: "Object deleted", id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
