"use client";
import { useState, useEffect } from "react";
import { Button, FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import PeopleTable from "../../Courses/[cid]/People/Table";
import * as client from "../client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await client.findAllUsers();
      console.log("[Users] Fetched users:", usersData);
      setUsers(usersData || []);
    } catch (error: any) {
      console.error("[Users] Error fetching users:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to fetch users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      let usersData;
      if (role && name) {
        // Filter by both role and name
        usersData = await client.findUsersByRoleAndName(role, name);
      } else if (role) {
        usersData = await client.findUsersByRole(role);
      } else if (name) {
        usersData = await client.findUsersByPartialName(name);
      } else {
        usersData = await client.findAllUsers();
      }
      console.log("[Users] Filtered users:", usersData);
      setUsers(usersData || []);
    } catch (error: any) {
      console.error("[Users] Error filtering users:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to filter users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsersByRole = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const filterUsersByName = (searchName: string) => {
    setName(searchName);
  };

  const createUser = async () => {
    try {
      const user = await client.createUser({
        firstName: "New",
        lastName: `User${users.length + 1}`,
        username: `newuser${Date.now()}`,
        password: "password123",
        email: `email${users.length + 1}@neu.edu`,
        section: "S101",
        role: "STUDENT",
      });
      setUsers([...users, user]);
      // If filtering, refresh the filtered list
      if (role || name) {
        filterUsers();
      } else {
        fetchUsers(); // Refresh all users
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error?.response?.data?.message || "Failed to create user. Please try again.");
    }
  };

  // Initial load - fetch all users
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter users when role or name changes (but not on initial mount)
  useEffect(() => {
    if (role || name) {
      filterUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, name]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Users</h3>
        <Button onClick={createUser} className="btn btn-danger wd-add-people" disabled={loading}>
          <FaPlus className="me-2" />
          Users
        </Button>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading && (
        <div className="alert alert-info" role="alert">
          Loading users...
        </div>
      )}
      <div className="mb-3">
        <FormControl
          onChange={(e) => filterUsersByName(e.target.value)}
          placeholder="Search people"
          className="float-start w-25 me-2 wd-filter-by-name"
          value={name}
        />
        <select
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="FACULTY">Faculty</option>
        </select>
        <div className="clearfix"></div>
      </div>
      {!loading && users.length === 0 && !error && (
        <div className="alert alert-info" role="alert">
          No users found.
        </div>
      )}
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}

