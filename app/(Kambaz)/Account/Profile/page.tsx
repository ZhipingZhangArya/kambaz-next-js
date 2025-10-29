"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, FormControl } from "react-bootstrap";
import { setCurrentUser, updateCurrentUser } from "../reducer";

export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // Helper function to update signupUsers in localStorage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSignupUsers = (updatedUser: any) => {
    const storedUsers = localStorage.getItem('signupUsers');
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        const userIndex = users.findIndex((u: any) => u._id === updatedUser._id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('signupUsers', JSON.stringify(users));
        }
      } catch (e) {
        console.error("Error updating signup users:", e);
      }
    }
  };
  
  // Helper function to handle field updates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldUpdate = (field: string, value: any) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    dispatch(updateCurrentUser({ [field]: value }));
    updateSignupUsers(updatedProfile);
  };
  
  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  };
  
  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };
  
  useEffect(() => {
    fetchProfile();
  }, [currentUser]);
  
  return (
    <div id="wd-profile-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Profile</h1>
          
          {profile && (
            <>
              <FormControl 
                id="wd-username"
                defaultValue={profile.username}
                onChange={(e) => handleFieldUpdate('username', e.target.value)}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-password"
                defaultValue={profile.password}
                onChange={(e) => handleFieldUpdate('password', e.target.value)}
                type="password"
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-firstname"
                placeholder="First Name"
                defaultValue={profile.firstName}
                onChange={(e) => handleFieldUpdate('firstName', e.target.value)}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-lastname"
                placeholder="Last Name"
                defaultValue={profile.lastName}
                onChange={(e) => handleFieldUpdate('lastName', e.target.value)}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-dob"
                type="date"
                placeholder="Date of Birth"
                defaultValue={profile.dob}
                onChange={(e) => handleFieldUpdate('dob', e.target.value)}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-email"
                placeholder="Email"
                defaultValue={profile.email}
                onChange={(e) => handleFieldUpdate('email', e.target.value)}
                type="email"
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-role"
                as="select"
                value={profile.role || "USER"}
                onChange={(e) => handleFieldUpdate('role', e.target.value)}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
              </FormControl>
              
              <Button 
                id="wd-signout-btn"
                onClick={signout}
                variant="danger"
                className="w-100"
                style={{ fontSize: '16px', padding: '12px' }}
              >
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}