"use client";
import { useState } from "react";

export default function EventObject() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [event, setEvent] = useState<any>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Create a safe copy of event properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventData: any = {
      type: e.type,
      timeStamp: e.timeStamp,
      target: (e.target as HTMLElement).outerHTML,
      currentTarget: (e.currentTarget as HTMLElement).outerHTML,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      defaultPrevented: e.defaultPrevented,
      eventPhase: e.eventPhase,
      isTrusted: e.isTrusted,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      button: e.button,
      buttons: e.buttons,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
    };
    setEvent(eventData);
  };
  return (
    <div>
      <h2>Event Object</h2>
      <button onClick={(e) => handleClick(e)}
        className="btn btn-primary"
        id="wd-display-event-obj-click">
        Display Event Object
      </button>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <hr/>
    </div>
  );
}

