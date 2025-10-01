import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Profile</h1>
          
          <Form.Control 
            id="wd-username"
            defaultValue="Zhiping Zhang"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Form.Control 
            id="wd-password"
            defaultValue="1234"
            type="password"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Form.Control 
            id="wd-first-name"
            defaultValue="Zhiping"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Form.Control 
            id="wd-last-name"
            defaultValue="Zhang"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Form.Control 
            id="wd-dob"
            type="date"
            placeholder="mm/dd/yyyy"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Form.Control 
            id="wd-email"
            defaultValue="zhang.zhip@northeastern.edu"
            type="email"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Form.Control 
            id="wd-role"
            defaultValue="Student"
            className="mb-3 border-secondary"
            style={{ fontSize: '16px', padding: '12px' }}
          />
          
          <Link 
            id="wd-signout-btn"
            href="/Account/Signin"
            className="btn btn-danger w-100"
            style={{ fontSize: '16px', padding: '12px' }}
          >
            Signout
          </Link>
        </div>
      </div>
    </div>
  );
}