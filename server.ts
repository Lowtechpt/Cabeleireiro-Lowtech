import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase (only if keys are present)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log("Supabase integrated successfully.");
} else {
  console.log("Supabase keys missing. Using in-memory storage (data will be lost on restart).");
}

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
  app.get("/api/bookings", async (req, res) => {
    // Basic admin check
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_KEY && process.env.NODE_ENV === "production") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    }

    res.json(bookings);
  });

  app.post("/api/bookings", async (req, res) => {
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

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data[0]);
    }

    bookings.push(newBooking);
    res.status(201).json(newBooking);
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) return res.status(500).json({ error: error.message });
      if (!data || data.length === 0) return res.status(404).json({ error: "Booking not found" });
      return res.json(data[0]);
    }

    const bookingIndex = bookings.findIndex((b) => b.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    bookings[bookingIndex] = { ...bookings[bookingIndex], status };
    res.json(bookings[bookingIndex]);
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) return res.status(500).json({ error: error.message });
      return res.status(204).send();
    }

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
