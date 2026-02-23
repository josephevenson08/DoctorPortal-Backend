import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertMedicalRecordSchema, insertReferralSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "./db";
import { auditLogs } from "@shared/schema";

async function logAction(username: string, action: string, details: string, ip: string) {
  try {
    await db.insert(auditLogs).values({ username, action, details, ipAddress: ip });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Auth ──────────────────────────────────────────────
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(data);
      const { password, ...safeUser } = user;
      await logAction(data.username, "REGISTER", `New account created for ${data.firstName} ${data.lastName}`, req.ip || "unknown");
      return res.status(201).json(safeUser);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(e).message });
      }
      throw e;
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        await logAction(username, "LOGIN_FAILED", `Failed login attempt for username: ${username}`, req.ip || "unknown");
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const { password: _, ...safeUser } = user;
      await logAction(username, "LOGIN", `${user.firstName} ${user.lastName} logged in successfully`, req.ip || "unknown");
      return res.json(safeUser);
    } catch (e) {
      throw e;
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    const { username } = req.body;
    if (username) {
      await logAction(username, "LOGOUT", `${username} logged out`, req.ip || "unknown");
    }
    return res.json({ success: true });
  });

  // ── Audit Logs ────────────────────────────────────────
  app.get("/api/audit-logs", async (req, res) => {
    const { passcode } = req.query;
    if (passcode !== "999999") {
      return res.status(403).json({ message: "Invalid passcode" });
    }
    try {
      const logs = await db.select().from(auditLogs).orderBy(auditLogs.timestamp);
      return res.json(logs);
    } catch (e) {
      throw e;
    }
  });

  // ── Doctors (now served from users table) ─────────────
  app.get("/api/doctors", async (_req, res) => {
    const allDoctors = await storage.getDoctors();
    return res.json(allDoctors);
  });

  // ── Patients ──────────────────────────────────────────
  app.get("/api/patients", async (_req, res) => {
    const allPatients = await storage.getPatients();
    return res.json(allPatients);
  });

  app.get("/api/patients/:id", async (req, res) => {
    const patient = await storage.getPatient(Number(req.params.id));
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    return res.json(patient);
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const body = { ...req.body };
      if (body.dob && typeof body.dob === "string") {
        body.dob = new Date(body.dob);
      }
      const data = insertPatientSchema.parse(body);
      const patient = await storage.createPatient(data);
      return res.status(201).json(patient);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(e).message });
      }
      throw e;
    }
  });

  app.patch("/api/patients/:id", async (req, res) => {
    const body = { ...req.body };
    if (body.dob && typeof body.dob === "string") {
      body.dob = new Date(body.dob);
    }
    const updated = await storage.updatePatient(Number(req.params.id), body);
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    return res.json(updated);
  });

  app.delete("/api/patients/:id", async (req, res) => {
    const deleted = await storage.deletePatient(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    return res.status(204).send();
  });

  // ── Medical Records ───────────────────────────────────
  app.get("/api/records", async (_req, res) => {
    const allRecords = await storage.getMedicalRecords();
    return res.json(allRecords);
  });

  app.get("/api/records/patient/:patientId", async (req, res) => {
    const records = await storage.getMedicalRecordsByPatient(Number(req.params.patientId));
    return res.json(records);
  });

  app.get("/api/records/:id", async (req, res) => {
    const record = await storage.getMedicalRecord(Number(req.params.id));
    if (!record) return res.status(404).json({ message: "Record not found" });
    return res.json(record);
  });

  app.post("/api/records", async (req, res) => {
    try {
      const data = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(data);
      return res.status(201).json(record);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(e).message });
      }
      throw e;
    }
  });

  app.patch("/api/records/:id", async (req, res) => {
    const updated = await storage.updateMedicalRecord(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Record not found" });
    return res.json(updated);
  });

  app.delete("/api/records/:id", async (req, res) => {
    const deleted = await storage.deleteMedicalRecord(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    return res.status(204).send();
  });

  // ── Referrals ─────────────────────────────────────────
  app.get("/api/referrals", async (_req, res) => {
    const allReferrals = await storage.getReferrals();
    return res.json(allReferrals);
  });

  app.get("/api/referrals/:id", async (req, res) => {
    const referral = await storage.getReferral(Number(req.params.id));
    if (!referral) return res.status(404).json({ message: "Referral not found" });
    return res.json(referral);
  });

  app.post("/api/referrals", async (req, res) => {
    try {
      const body = { ...req.body };
      if (body.dateTime && typeof body.dateTime === "string") {
        body.dateTime = new Date(body.dateTime);
      }
      const data = insertReferralSchema.parse(body);
      const referral = await storage.createReferral(data);
      return res.status(201).json(referral);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(e).message });
      }
      throw e;
    }
  });

  app.patch("/api/referrals/:id", async (req, res) => {
    const updated = await storage.updateReferral(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Referral not found" });
    return res.json(updated);
  });

  app.delete("/api/referrals/:id", async (req, res) => {
    const deleted = await storage.deleteReferral(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Referral not found" });
    return res.status(204).send();
  });

  return httpServer;
}