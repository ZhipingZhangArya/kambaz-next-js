"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import * as db from "../../Database";

export default function Signin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();
  
  const signin = () => {
    console.log("Signin attempt:", credentials);
    if (!credentials.username || !credentials.password) {
      alert("Please enter both username and password");
      return;
    }
    
    // First check localStorage for signup users
    let user = null;
    const storedUsers = localStorage.getItem('signupUsers');
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user = users.find(
          (u: any) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );
      } catch (e) {
        console.error("Error parsing stored users:", e);
      }
    }
    
    // If not found in localStorage, check database
    if (!user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user = db.users.find(
        (u: any) =>
          u.username === credentials.username &&
          u.password === credentials.password
      );
    }
    
    console.log("User found:", user);
    if (!user) {
      alert("Invalid username or password");
      return;
    }
    dispatch(setCurrentUser(user));
    console.log("User dispatched to Redux");
    router.push("/Dashboard");
  };
  
  return (
    <div id="wd-signin-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Signin</h1>
          
          <Form.Control 
            id="wd-username"
            placeholder="username"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
            value={credentials.username || ""}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          
          <Form.Control 
            id="wd-password"
            placeholder="password" 
            type="password"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
            value={credentials.password || ""}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          
          <Button 
            id="wd-signin-btn"
            onClick={signin}
            className="btn btn-primary w-100 mb-3"
            style={{ fontSize: '16px', padding: '12px' }}
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
