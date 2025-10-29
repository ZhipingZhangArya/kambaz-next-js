"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import { v4 as uuidv4 } from "uuid";

export default function Signup() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();
  
  const signup = () => {
    const newUser = {
      _id: uuidv4(),
      username: credentials.username,
      password: credentials.password,
      firstName: credentials.firstName || "",
      lastName: credentials.lastName || "",
      email: credentials.email || "",
      dob: credentials.dob || "",
      role: credentials.role || "STUDENT"
    };
    
    // Save new user to localStorage
    const storedUsers = localStorage.getItem('signupUsers');
    let users = [];
    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch (e) {
        console.error("Error parsing stored users:", e);
      }
    }
    users.push(newUser);
    localStorage.setItem('signupUsers', JSON.stringify(users));
    
    dispatch(setCurrentUser(newUser));
    router.push("/Account/Profile");
  };
  
  return (
    <div id="wd-signup-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Signup</h1>
          
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
            id="wd-signup-btn"
            onClick={signup}
            className="btn btn-primary w-100 mb-3"
            style={{ fontSize: '16px', padding: '12px' }}
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