export class TypingClient {
  private userId: string;
  private listeners: ((users: string[]) => void)[] = [];
  private source: EventSource;

  constructor(eventsUrl: string, userId: string) {
    this.userId = userId;
    this.source = new EventSource(eventsUrl);

    this.source.addEventListener("typing", (event) => {
      const users = JSON.parse((event as MessageEvent).data);
      this.listeners.forEach((cb) => cb(users));
    });
  }

  /**
   * Register a callback that fires whenever the server broadcasts
   * a list of users who are currently typing.
   */
  onUpdate(cb: (users: string[]) => void) {
    this.listeners.push(cb);
  }

  /**
   * Call this whenever the local user is typing.
   */
  sendTyping(url = "/typing") {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: this.userId }),
    });
  }
}
