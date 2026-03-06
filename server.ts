import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for bookings (for demo/preview)
  // In production, use a real database like Supabase or Vercel Postgres
  let bookings: any[] = [
    {
      id: "1",
      name: "Maria Silva",
      email: "maria@example.com",
      phone: "912345678",
      service: "Corte de Autor",
      date: "2026-03-10",
      time: "10:00",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ];

  // API Routes
  app.get("/api/bookings", (req, res) => {
    // Basic admin check (could be improved with real auth)
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_KEY && process.env.NODE_ENV === "production") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { name, email, phone, service, date, time } = req.body;
    
    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      service,
      date,
      time,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
  });

  app.patch("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const bookingIndex = bookings.findIndex((b) => b.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    bookings[bookingIndex] = { ...bookings[bookingIndex], status };
    res.json(bookings[bookingIndex]);
  });

  app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter((b) => b.id !== id);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
