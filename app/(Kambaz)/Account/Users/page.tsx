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

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };

  const filterUsers = async () => {
    if (role && name) {
      // Filter by both role and name
      const users = await client.findUsersByRoleAndName(role, name);
      setUsers(users);
    } else if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
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
        <Button onClick={createUser} className="btn btn-danger wd-add-people">
          <FaPlus className="me-2" />
          Users
        </Button>
      </div>
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
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
        <div className="clearfix"></div>
      </div>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}

