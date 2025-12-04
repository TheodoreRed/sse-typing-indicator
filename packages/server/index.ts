import type { Express, Response } from "express";

export function createTypingServer(
  app: Express,
  options: { timeout?: number } = {}
) {
  const timeout = options.timeout ?? 2000;

  const clients = new Map<number, Response>();
  let typingUsers = new Map<string, number>();

  // SSE endpoint
  app.get("/typing/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const id = Date.now();
    clients.set(id, res);

    req.on("close", () => clients.delete(id));
  });

  // Receive typing events from clients
  app.post("/typing", (req, res) => {
    const { user } = req.body as { user: string };
    typingUsers.set(user, Date.now());
    broadcast();
    res.json({ ok: true });
  });

  function broadcast() {
    const users = [...typingUsers.keys()];
    const payload = `event: typing\ndata: ${JSON.stringify(users)}\n\n`;

    for (const res of clients.values()) {
      res.write(payload);
    }
  }

  // Clear typers who stopped
  setInterval(() => {
    const now = Date.now();
    let changed = false;

    for (const [user, time] of typingUsers.entries()) {
      if (now - time > timeout) {
        typingUsers.delete(user);
        changed = true;
      }
    }

    if (changed) broadcast();
  }, 500);

  return {
    broadcast,
    getTypingUsers: () => [...typingUsers.keys()],
  };
}
