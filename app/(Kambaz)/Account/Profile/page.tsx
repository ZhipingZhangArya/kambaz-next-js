"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FormControl, Button } from "react-bootstrap";
import { setCurrentUser, updateCurrentUser } from "../reducer";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  };
  
  const updateProfile = async () => {
    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      setError(null);
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? "Unable to update profile. Try again.";
      setError(message);
    }
  };
  
  const signout = async () => {
    try {
      await client.signout();
    } catch (error) {
      console.error("Signout failed", error);
    } finally {
      dispatch(setCurrentUser(null));
      router.push("/Account/Signin");
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, [currentUser]);
  
  return (
    <div id="wd-profile-screen" className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4 fw-bold text-dark">Profile</h1>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {profile && (
            <>
              <FormControl 
                id="wd-username"
                value={profile.username || ""}
                onChange={(e) => {
                  const updatedProfile = { ...profile, username: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ username: e.target.value }));
                }}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-password"
                value={profile.password || ""}
                onChange={(e) => {
                  const updatedProfile = { ...profile, password: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ password: e.target.value }));
                }}
                type="password"
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-firstname"
                placeholder="First Name"
                value={profile.firstName || ""}
                onChange={(e) => {
                  const updatedProfile = { ...profile, firstName: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ firstName: e.target.value }));
                }}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-lastname"
                placeholder="Last Name"
                value={profile.lastName || ""}
                onChange={(e) => {
                  const updatedProfile = { ...profile, lastName: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ lastName: e.target.value }));
                }}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-dob"
                type="date"
                placeholder="Date of Birth"
                value={profile.dob || ""}
                onChange={(e) => {
                  const updatedProfile = { ...profile, dob: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ dob: e.target.value }));
                }}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-email"
                placeholder="Email"
                value={profile.email || ""}
                onChange={(e) => {
                  const updatedProfile = { ...profile, email: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ email: e.target.value }));
                }}
                type="email"
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
              
              <FormControl 
                id="wd-role"
                as="select"
                value={profile.role || "USER"}
                onChange={(e) => {
                  const updatedProfile = { ...profile, role: e.target.value };
                  setProfile(updatedProfile);
                  dispatch(updateCurrentUser({ role: e.target.value }));
                }}
                className="mb-3 border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
              </FormControl>
              
              <Button
                id="wd-update-profile-btn"
                onClick={updateProfile}
                variant="primary"
                className="w-100 mb-2"
                style={{ fontSize: "16px", padding: "12px" }}
              >
                Update
              </Button>
              
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