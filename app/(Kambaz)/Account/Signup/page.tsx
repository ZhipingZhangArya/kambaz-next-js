"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FormControl, Button } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    if (!user.username || !user.password) {
      setError("Please enter both username and password");
      return;
    }
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      setError(null);
      router.push("/Account/Profile");
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? "Unable to sign up. Please try again.";
      setError(message);
    }
  };

  return (
    <div id="wd-signup-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Signup</h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <FormControl
            id="wd-username"
            placeholder="username"
            className="mb-3 border-secondary"
            style={{ fontSize: "16px", padding: "12px" }}
            value={user.username || ""}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />

          <FormControl
            id="wd-password"
            placeholder="password"
            type="password"
            className="mb-3 border-secondary"
            style={{ fontSize: "16px", padding: "12px" }}
            value={user.password || ""}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <FormControl
            id="wd-role"
            as="select"
            placeholder="Role"
            className="mb-3 border-secondary"
            style={{ fontSize: "16px", padding: "12px" }}
            value={user.role || "STUDENT"}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
          </FormControl>

          <Button
            id="wd-signup-btn"
            onClick={signup}
            className="btn btn-primary w-100 mb-3"
            style={{ fontSize: "16px", padding: "12px" }}
          >
            Signup
          </Button>

          <Link
            id="wd-signin-link"
            href="/Account/Signin"
            className="text-primary text-decoration-underline"
          >
            Signin
          </Link>
        </div>
      </div>
    </div>
  );
}