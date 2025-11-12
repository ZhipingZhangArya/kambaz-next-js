"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password");
      return;
    }
    try {
      const user = await client.signin(credentials);
      if (!user) {
        setError("Invalid username or password");
        return;
      }
      dispatch(setCurrentUser(user));
      setError(null);
      router.push("/Dashboard");
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? "Unable to sign in. Please try again.";
      setError(message);
    }
  };

  return (
    <div id="wd-signin-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Signin</h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form.Control
            id="wd-username"
            placeholder="username"
            className="mb-3 border-secondary"
            style={{ fontSize: "16px", padding: "12px" }}
            value={credentials.username || ""}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <Form.Control
            id="wd-password"
            placeholder="password"
            type="password"
            className="mb-3 border-secondary"
            style={{ fontSize: "16px", padding: "12px" }}
            value={credentials.password || ""}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <Button
            id="wd-signin-btn"
            onClick={signin}
            className="btn btn-primary w-100 mb-3"
            style={{ fontSize: "16px", padding: "12px" }}
          >
            Signin
          </Button>

          <Link
            id="wd-signup-link"
            href="/Account/Signup"
            className="text-primary text-decoration-underline"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
