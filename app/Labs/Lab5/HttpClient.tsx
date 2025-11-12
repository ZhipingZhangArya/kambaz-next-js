"use client";

import { useEffect, useState } from "react";
import * as client from "./client";

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");

  const fetchWelcomeOnClick = async () => {
    try {
      const message = await client.fetchWelcomeMessage();
      setWelcomeOnClick(message);
    } catch (e) {
      console.error(e);
      setWelcomeOnClick("Error fetching welcome message");
    }
  };

  const fetchWelcomeOnLoad = async () => {
    try {
      const message = await client.fetchWelcomeMessage();
      setWelcomeOnLoad(message);
    } catch (e) {
      console.error(e);
      setWelcomeOnLoad("Error fetching welcome message");
    }
  };

  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);

  return (
    <div id="wd-http-client" className="mt-3">
      <h3>HTTP Client</h3>
      <hr />
      <h4>Requesting on Click</h4>
      <button className="btn btn-primary me-2" onClick={fetchWelcomeOnClick}>
        Fetch Welcome
      </button>
      <div className="mt-2">
        Response from server: <b>{welcomeOnClick}</b>
      </div>
      <hr />
      <h4>Requesting on Load</h4>
      <div className="mt-2">
        Response from server: <b>{welcomeOnLoad}</b>
      </div>
      <hr />
    </div>
  );
}
