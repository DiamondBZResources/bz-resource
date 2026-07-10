import cors = require("cors");
import dotenv = require("dotenv");
import express = require("express");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ status: "ok" });
});

app.post("/api/contact", (req, res) => {
  res.set("Cache-Control", "no-store");

  const { firstName, lastName, email, phone, comments } = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    comments?: string;
  };

  const requiredFields = [firstName, lastName, email, phone, comments];
  const missingRequiredField = requiredFields.some(
    (value) => typeof value !== "string" || value.trim().length === 0,
  );
  const emailLooksValid =
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (missingRequiredField || !emailLooksValid) {
    res.status(400).json({
      ok: false,
      delivery: false,
      message: "Please complete all fields with a valid email address.",
    });
    return;
  }

  console.log("Contact form received", {
    firstName,
    lastName,
    email,
    phone,
    comments,
  });

  res.status(202).json({
    ok: true,
    delivery: false,
    message:
      "Message received by the development server. Delivery is not configured yet.",
  });
});

app.use(((error, _req, res, _next) => {
  console.error(error);
  res.set("Cache-Control", "no-store");
  res.status(500).json({
    ok: false,
    message: "An unexpected server error occurred.",
  });
}) as express.ErrorRequestHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
