import type { Express } from "express";
import { db } from "../../db";
import { auditLogs } from "@shared/schema";

export function registerAuditRoutes(app: Express): void {
  app.get("/api/audit-logs", async (req, res) => {
    const { passcode } = req.query;
    if (passcode !== "999999") {
      return res.status(403).json({ message: "Invalid passcode" }); // Keep current access behavior.
    }

    const logs = await db.select().from(auditLogs).orderBy(auditLogs.timestamp); // Sort by log timestamp.
    return res.json(logs);
  });
}
