import { EventEmitter2 } from "eventemitter2";

class Event extends EventEmitter2 {
  on(event: string | symbol, listener: (...args: any[]) => void) {
    console.log(
      `[EventEmitter] Listener registered for event: "${String(event)}"`
    );
    return super.on(event, listener);
  }
}

export const emitter = new Event();
