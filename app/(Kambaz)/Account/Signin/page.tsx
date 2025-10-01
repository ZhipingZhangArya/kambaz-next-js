import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signin() {
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
          />
          
          <Form.Control 
            id="wd-password"
            placeholder="password" 
            type="password"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Link 
            id="wd-signin-btn"
            href="/Account/Profile"
            className="btn btn-primary w-100 mb-3"
            style={{ fontSize: '16px', padding: '12px' }}
          >
            Signin
          </Link>
          
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
