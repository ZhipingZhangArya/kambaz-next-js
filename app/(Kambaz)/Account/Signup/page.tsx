import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signup() {
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
          />
          
          <Form.Control 
            id="wd-password"
            placeholder="password" 
            type="password"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Link 
            id="wd-signup-btn"
            href="/Account/Profile"
            className="btn btn-primary w-100 mb-3"
            style={{ fontSize: '16px', padding: '12px' }}
          >
            Signup
          </Link>
          
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