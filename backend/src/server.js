import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

/* ---------- FIX __dirname (ESM SAFE) ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: true, // ✅ allow Render domain
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ---------- API ROUTES ---------- */
app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

/* ---------- SERVE FRONTEND ---------- */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../frontend/dist/index.html")
    );
  });
}

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
