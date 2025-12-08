import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateCodeSchema, updateLanguageSchema, executeCodeSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/session/create", async (req, res) => {
    try {
      const session = await storage.createSession();
      res.json({
        id: session.id,
        code: session.code,
        language: session.language,
        createdAt: session.createdAt,
      });
    } catch (error) {
      console.error("Failed to create session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.get("/api/session/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Failed to get session:", error);
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  app.patch("/api/session/:id/code", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedBody = updateCodeSchema.parse(req.body);
      
      const session = await storage.updateSessionCode(id, validatedBody.code);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({ success: true, code: session.code });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid request body", errors: error.errors });
      }
      console.error("Failed to update code:", error);
      res.status(500).json({ message: "Failed to update code" });
    }
  });

  app.patch("/api/session/:id/language", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedBody = updateLanguageSchema.parse(req.body);
      
      const session = await storage.updateSessionLanguage(id, validatedBody.language);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({ code: session.code });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid request body", errors: error.errors });
      }
      console.error("Failed to update language:", error);
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  app.post("/api/session/:id/execute", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedBody = executeCodeSchema.parse(req.body);
      
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({
        output: "Code execution handled client-side",
        executionTime: 0,
        language: validatedBody.language,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid request body", errors: error.errors });
      }
      console.error("Failed to execute code:", error);
      res.status(500).json({ message: "Failed to execute code" });
    }
  });

  return httpServer;
}
