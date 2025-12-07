import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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
      const { code } = req.body;
      
      if (typeof code !== "string") {
        return res.status(400).json({ message: "Code must be a string" });
      }
      
      const session = await storage.updateSessionCode(id, code);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to update code:", error);
      res.status(500).json({ message: "Failed to update code" });
    }
  });

  app.patch("/api/session/:id/language", async (req, res) => {
    try {
      const { id } = req.params;
      const { language } = req.body;
      
      if (language !== "javascript" && language !== "python") {
        return res.status(400).json({ message: "Language must be 'javascript' or 'python'" });
      }
      
      const session = await storage.updateSessionLanguage(id, language);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({ code: session.code });
    } catch (error) {
      console.error("Failed to update language:", error);
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  app.post("/api/session/:id/execute", async (req, res) => {
    try {
      const { id } = req.params;
      const { code, language } = req.body;
      
      if (typeof code !== "string") {
        return res.status(400).json({ message: "Code must be a string" });
      }
      
      if (language !== "javascript" && language !== "python") {
        return res.status(400).json({ message: "Language must be 'javascript' or 'python'" });
      }
      
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({
        output: "Code execution handled client-side",
        executionTime: 0,
        language,
      });
    } catch (error) {
      console.error("Failed to execute code:", error);
      res.status(500).json({ message: "Failed to execute code" });
    }
  });

  return httpServer;
}
