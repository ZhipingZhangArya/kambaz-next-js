"use client";
import { useEffect, useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../Account/client";

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      try {
        const userData = await client.findUserById(uid);
        setUser(userData);
        setName(`${userData.firstName || ""} ${userData.lastName || ""}`.trim());
        setEmail(userData.email || "");
        setRole(userData.role || "");
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    if (uid) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const saveUser = async () => {
    try {
      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ") || "";
      const updatedUser = {
        ...user,
        firstName: firstName || "",
        lastName: lastName || "",
        email: email,
        role: role,
      };
      const savedUser = await client.updateUser(updatedUser);
      setUser(savedUser);
      setEditing(false);
      setEditingName(false);
      setEditingEmail(false);
      setEditingRole(false);
      onClose(); // Close the details panel and refresh the user list
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!uid) return;
    try {
      await client.deleteUser(uid);
      onClose(); // Close the details panel and refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Handle Enter key press for saving
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveUser();
    }
  };

  if (!uid) return null;

  // Determine if any field is being edited
  const isAnyFieldEditing = editing || editingName || editingEmail || editingRole;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      {/* Name field */}
      <div className="text-danger fs-4 d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          {!editing && !editingName && (
            <div
              className="wd-name"
              onClick={() => setEditingName(true)}
              style={{ cursor: "pointer" }}
            >
              {user?.firstName || ""} {user?.lastName || ""}
            </div>
          )}
          {(editing || editingName) && (
            <FormControl
              className="w-50 wd-edit-name"
              defaultValue={`${user?.firstName || ""} ${user?.lastName || ""}`}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus={editingName && !editing}
            />
          )}
        </div>
        {/* Edit/Save icon next to name, aligned to right */}
        {!isAnyFieldEditing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="fs-5 wd-edit ms-2"
            style={{ cursor: "pointer" }}
          />
        )}
        {isAnyFieldEditing && (
          <FaCheck
            onClick={() => saveUser()}
            className="fs-5 wd-save ms-2"
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      {/* Email field */}
      <div className="mt-2">
        <b>Email:</b>{" "}
        {!editing && !editingEmail && (
          <span
            className="wd-email"
            onClick={() => setEditingEmail(true)}
            style={{ cursor: "pointer" }}
          >
            {user?.email || "N/A"}
          </span>
        )}
        {(editing || editingEmail) && (
          <FormControl
            type="email"
            className="w-50 d-inline-block wd-edit-email-input"
            defaultValue={user?.email || ""}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={editingEmail && !editing}
          />
        )}
      </div>
      {/* Role field */}
      <div className="mt-2">
        <b>Roles:</b>{" "}
        {!editing && !editingRole && (
          <span
            className="wd-roles"
            onClick={() => setEditingRole(true)}
            style={{ cursor: "pointer" }}
          >
            {user?.role || "N/A"}
          </span>
        )}
        {(editing || editingRole) && (
          <select
            className="form-select w-50 d-inline-block wd-edit-role-select"
            value={role || user?.role || ""}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={editingRole && !editing}
          >
            <option value="USER">User</option>
            <option value="STUDENT">Student</option>
            <option value="TA">TA</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
      </div>
      <b>Login ID:</b> <span className="wd-login-id">{user?.loginId || user?.username || "N/A"}</span> <br />
      <b>Section:</b> <span className="wd-section">{user?.section || "N/A"}</span> <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user?.totalActivity || "N/A"}</span>
      <hr />
      <div className="d-flex gap-2 mt-3">
        <Button variant="secondary" onClick={onClose} className="flex-fill">
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} className="flex-fill">
          Delete
        </Button>
      </div>
    </div>
  );
}

