"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  FormControl,
  Modal,
  Form,
  FormSelect,
} from "react-bootstrap";
import { FaUserCircle, FaTrash, FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import * as client from "../../../client";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  loginId: string;
  section: string;
  role: string;
  lastActivity?: string;
  totalActivity?: string;
  email?: string;
}

export default function PeopleTable() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [user, setUser] = useState<User>({
    _id: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    loginId: "",
    section: "",
    role: "STUDENT",
    email: "",
  });

  const isFaculty = currentUser?.role === "FACULTY";

  const fetchUsers = async () => {
    if (!cid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await client.findUsersForCourse(cid as string);
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  const handleCreate = () => {
    setEditingUser(null);
    setUser({
      _id: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      loginId: "",
      section: "",
      role: "STUDENT",
      email: "",
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUser({ ...user, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await client.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error deleting user");
      console.error("Error deleting user:", err);
    }
  };

  const handleSave = async () => {
    if (!cid) return;
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = await client.updateUser(user);
        setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      } else {
        // Create new user
        if (!user.username || !user.password) {
          setError("Username and password are required");
          return;
        }
        const newUser = await client.createUserForCourse(cid as string, user);
        setUsers([...users, newUser]);
      }
      setShowModal(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving user");
      console.error("Error saving user:", err);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setUser({
      _id: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      loginId: "",
      section: "",
      role: "STUDENT",
      email: "",
    });
    setEditingUser(null);
    setError(null);
  };

  return (
    <div id="wd-people-table" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>People</h2>
        {isFaculty && (
          <Button variant="primary" onClick={handleCreate}>
            <FaPlus className="me-2" />
            Add User
          </Button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Login ID</th>
              <th>Section</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Total Activity</th>
              {isFaculty && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
                </td>
                <td className="wd-login-id">{user.loginId || user.username}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">
                  {user.lastActivity || "N/A"}
                </td>
                <td className="wd-total-activity">
                  {user.totalActivity || "N/A"}
                </td>
                {isFaculty && (
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="me-2"
                    >
                      <FaPencil />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                      className="text-danger"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create/Edit User Modal */}
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Edit User" : "Create User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <FormControl
                value={user.firstName}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                placeholder="First Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <FormControl
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                placeholder="Last Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username *</Form.Label>
              <FormControl
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
                required
                disabled={!!editingUser}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password {!editingUser && "*"}</Form.Label>
              <FormControl
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
                required={!editingUser}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Login ID</Form.Label>
              <FormControl
                value={user.loginId}
                onChange={(e) => setUser({ ...user, loginId: e.target.value })}
                placeholder="Login ID"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Section</Form.Label>
              <FormControl
                value={user.section}
                onChange={(e) => setUser({ ...user, section: e.target.value })}
                placeholder="Section"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <FormSelect
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="TA">TA</option>
                <option value="FACULTY">Faculty</option>
              </FormSelect>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <FormControl
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingUser ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
