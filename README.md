# SSE Typing Indicator

A lightweight Server-Sent Events (SSE) typing indicator system for real-time apps.  
Includes two packages:

- **@theodorered/sse-typing-server** – Node/Express backend helper
- **@theodorered/sse-typing-client** – Browser client helper

This makes it easy to add "User is typing…" features to any chat, support tool, or collaborative UI.

## Installation

### npm

```bash
npm install @theodorered/sse-typing-server @theodorered/sse-typing-client
```

### pnpm

```bash
pnpm add @theodorered/sse-typing-server @theodorered/sse-typing-client
```

### yarn

```bash
yarn add @theodorered/sse-typing-server @theodorered/sse-typing-client
```

---

## Usage

### **Server (Node + Express)**

```ts
import express from "express";
import { createTypingServer } from "@theodorered/sse-typing-server";

const app = express();
app.use(express.json());

// Add typing indicator endpoints
createTypingServer(app);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

This creates:

- `GET /typing/events` → SSE stream
- `POST /typing` → notify server that a user is typing

---

### **Client (Browser)**

```ts
import { TypingClient } from "@theodorered/sse-typing-client";

const typing = new TypingClient("/typing/events", "Alice");

// Listen for updates
typing.onUpdate((users) => {
  console.log("Users typing:", users);
});

// Call this whenever the user types
function onInput() {
  typing.sendTyping();
}
```

---

## Packages

### `@theodorered/sse-typing-server`

- Express helper that handles SSE connections
- Broadcasts current "users typing"
- Automatically clears idle users

### `@theodorered/sse-typing-client`

- Connects to the SSE stream
- Provides `onUpdate()` for UI updates
- Sends typing signals to the server

---

## Contributing

Contributions, issues, and suggestions are welcome.
Feel free to open a PR or create an issue in the repository.

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this software.
