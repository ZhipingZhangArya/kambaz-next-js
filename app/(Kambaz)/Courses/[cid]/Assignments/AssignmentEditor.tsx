"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl } from "react-bootstrap";
import { setAssignments } from "./reducer";
import * as client from "./client";

export default function AssignmentEditor() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const aid = searchParams.get("aid");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = !!aid;

  const existingAssignment = aid
    ? assignments.find((a: any) => a._id === aid && a.course === cid)
    : null;

  const [assignment, setAssignment] = useState<any>({
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntil: "",
    course: cid as string,
  });

  useEffect(() => {
    if (cid) {
      setAssignment((prev: any) => ({ ...prev, course: cid as string }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const loadAssignment = async () => {
    if (isEditMode) {
      try {
        if (existingAssignment) {
          setAssignment({
            _id: existingAssignment._id,
            title: existingAssignment.title || "",
            description: existingAssignment.description || "",
            points: existingAssignment.points || 100,
            dueDate: existingAssignment.dueDate || "",
            availableDate: existingAssignment.availableDate || "",
            availableUntil: existingAssignment.availableUntil || existingAssignment.dueDate || "",
            course: existingAssignment.course,
          });
        } else if (aid) {
          const fetched = await client.findAssignmentById(aid);
          setAssignment({
            _id: fetched._id,
            title: fetched.title || "",
            description: fetched.description || "",
            points: fetched.points || 100,
            dueDate: fetched.dueDate || "",
            availableDate: fetched.availableDate || "",
            availableUntil: fetched.availableUntil || fetched.dueDate || "",
            course: fetched.course,
          });
        }
      } catch (err) {
        console.error("Error loading assignment", err);
        setError("Unable to load assignment.");
      }
    }
  };

  useEffect(() => {
    loadAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aid, existingAssignment]);

  const handleSave = async () => {
    if (!cid) return;
    setIsSaving(true);
    try {
      if (isEditMode) {
        const updatedAssignment = await client.updateAssignment(assignment);
        dispatch(
          setAssignments(
            assignments.map((a: any) =>
              a._id === updatedAssignment._id ? updatedAssignment : a
            )
          )
        );
      } else {
        const newAssignment = await client.createAssignment(cid as string, {
          ...assignment,
        });
        dispatch(setAssignments([...assignments, newAssignment]));
      }
      setError(null);
      router.push(`/Courses/${cid}/Assignments`);
    } catch (err) {
      console.error("Error saving assignment", err);
      setError("Unable to save assignment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div className="container-fluid p-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="form-label fw-normal text-dark">Assignment Name</label>
        <FormControl
          type="text"
          id="wd-name"
          placeholder="New Assignment"
          value={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
          className="border-secondary"
          style={{ fontSize: "16px", padding: "12px" }}
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-normal text-dark">
          New Assignment Description
        </label>
        <FormControl
          as="textarea"
          rows={5}
          id="wd-description"
          placeholder="Assignment Description"
          value={assignment.description}
          onChange={(e) =>
            setAssignment({ ...assignment, description: e.target.value })
          }
          className="border-secondary"
          style={{ fontSize: "16px", padding: "12px" }}
        />
      </div>

      <div className="mb-3 d-flex align-items-center">
        <label
          className="form-label fw-normal text-dark mb-0 me-3 text-end"
          style={{ minWidth: "150px" }}
        >
          Points
        </label>
        <FormControl
          type="number"
          id="wd-points"
          value={assignment.points}
          onChange={(e) =>
            setAssignment({
              ...assignment,
              points: parseInt(e.target.value) || 0,
            })
          }
          className="border-secondary"
          style={{ fontSize: "16px", padding: "12px" }}
        />
      </div>

      <div className="mb-3 d-flex align-items-start">
        <label
          className="form-label fw-normal text-dark mb-0 me-3 text-end"
          style={{ minWidth: "150px" }}
        >
          Assign
        </label>
        <div
          className="flex-fill border border-secondary rounded p-3"
          style={{ backgroundColor: "white" }}
        >
          <div className="mb-3">
            <div className="mb-2">
              <label className="fw-bold text-dark mb-0">Due</label>
            </div>
            <FormControl
              type="datetime-local"
              value={assignment.dueDate}
              onChange={(e) =>
                setAssignment({ ...assignment, dueDate: e.target.value })
              }
              className="border-secondary"
              style={{ fontSize: "16px", padding: "12px" }}
            />
          </div>

          <div className="row">
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Available from</div>
              <FormControl
                type="datetime-local"
                value={assignment.availableDate}
                onChange={(e) =>
                  setAssignment({ ...assignment, availableDate: e.target.value })
                }
                className="border-secondary"
                style={{ fontSize: "16px", padding: "12px" }}
              />
            </div>
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Until</div>
              <FormControl
                type="datetime-local"
                value={assignment.availableUntil}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    availableUntil: e.target.value,
                  })
                }
                className="border-secondary"
                style={{ fontSize: "16px", padding: "12px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="px-4 py-2"
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleSave}
          className="px-4 py-2"
          disabled={isSaving}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

