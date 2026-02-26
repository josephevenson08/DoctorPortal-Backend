import type { Express } from "express";
import { storage } from "../../storage";
import { insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { logAction } from "../../lib/audit";

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body); // Validate incoming payload.
      const existing = await storage.getUserByUsername(data.username); // Prevent duplicate usernames.
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(data);
      const { password, ...safeUser } = user; // Never return password.

      await logAction(
        data.username,
        "REGISTER",
        `New account created for ${data.firstName} ${data.lastName}`,
        req.ip || "unknown",
      );

      return res.status(201).json(safeUser);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(e).message });
      }
      throw e;
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      await logAction(
        username,
        "LOGIN_FAILED",
        `Failed login attempt for username: ${username}`,
        req.ip || "unknown",
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, ...safeUser } = user; // Strip sensitive field.

    await logAction(
      username,
      "LOGIN",
      `${user.firstName} ${user.lastName} logged in successfully`,
      req.ip || "unknown",
    );

    return res.json(safeUser);
  });

  app.post("/api/auth/logout", async (req, res) => {
    const { username } = req.body;
    if (username) {
      await logAction(username, "LOGOUT", `${username} logged out`, req.ip || "unknown");
    }
    return res.json({ success: true });
  });

  app.get("/api/doctors", async (_req, res) => {
    const allDoctors = await storage.getDoctors(); // Doctors come from users table.
    return res.json(allDoctors);
  });
}
