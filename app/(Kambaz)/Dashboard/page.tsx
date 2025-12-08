"use client";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormControl,
} from "react-bootstrap";
import { setCourses } from "../Courses/reducer";
import {
  setEnrollments,
  addEnrollment,
  deleteEnrollment,
} from "../Courses/enrollmentsReducer";
import * as coursesClient from "../Courses/client";
import * as enrollmentsClient from "../Courses/enrollmentsClient";

export default function Dashboard() {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showAllCourses, setShowAllCourses] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
    coverImage: "/images/reactjs.jpg",
  });

  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser?._id &&
        enrollment.course === courseId
    );

  const fetchCourses = async () => {
    if (!currentUser?._id && !showAllCourses) {
      dispatch(setCourses([]));
      return;
    }

    setIsLoadingCourses(true);
    setError(null);
    try {
      const data = showAllCourses
        ? await coursesClient.fetchAllCourses()
        : await coursesClient.findMyCourses();
      dispatch(setCourses(data || []));
    } catch (err: any) {
      // If 401, user is not authenticated - don't show error, just show empty
      if (err.response?.status === 401) {
        dispatch(setCourses([]));
        return;
      }
      console.error("Error fetching courses", err);
      dispatch(setCourses([]));
      setError("Unable to load courses.");
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!currentUser?._id) {
      dispatch(setEnrollments([]));
      return;
    }

    setIsLoadingEnrollments(true);
    try {
      const data = await enrollmentsClient.fetchMyEnrollments();
      dispatch(setEnrollments(data));
      setError(null);
    } catch (err: any) {
      // If 401, user is not authenticated - don't show error, just show empty
      if (err.response?.status === 401) {
        console.log("[Dashboard] User not authenticated, skipping enrollments fetch");
        dispatch(setEnrollments([]));
        return;
      }
      console.error("Error fetching enrollments", err);
      dispatch(setEnrollments([]));
      // Don't set error for 401 - it's expected if user just signed up
      if (err.response?.status !== 401) {
        setError("Unable to load enrollments.");
      }
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, showAllCourses]);

  const filteredCourses = showAllCourses
    ? courses
    : courses.filter((course: any) => isEnrolled(course._id));

  const onAddNewCourse = async () => {
    if (!currentUser?._id) return;
    try {
      const newCourse = await coursesClient.createCourse(course);
      dispatch(setCourses([...courses, newCourse]));
      setCourse({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
        coverImage: "/images/reactjs.jpg",
      });
      await fetchEnrollments();
      setError(null);
    } catch (err) {
      console.error("Error creating course", err);
      setError("Unable to create course.");
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      await coursesClient.deleteCourse(courseId);
      dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
      await fetchEnrollments();
      setError(null);
    } catch (err) {
      console.error("Error deleting course", err);
      setError("Unable to delete course.");
    }
  };

  const onUpdateCourse = async () => {
    try {
      const updatedCourse = await coursesClient.updateCourse(course);
      dispatch(
        setCourses(
          courses.map((c: any) =>
            c._id === updatedCourse._id ? updatedCourse : c
          )
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error updating course", err);
      setError("Unable to update course.");
    }
  };

  const handleEnrollmentToggle = async (
    e: MouseEvent<HTMLButtonElement>,
    courseId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser?._id) {
      setError("You must be signed in to manage enrollments.");
      return;
    }

    if (isEnrolled(courseId)) {
      const enrollment = enrollments.find(
        (enrollment: any) =>
          enrollment.user === currentUser?._id &&
          enrollment.course === courseId
      );
      if (!enrollment) return;
      try {
        await enrollmentsClient.unenrollFromCourse(courseId);
        dispatch(deleteEnrollment(enrollment._id));
        setError(null);
      } catch (err) {
        console.error("Error unenrolling", err);
        setError("Unable to unenroll from course.");
      }
    } else {
      try {
        const newEnrollment = await enrollmentsClient.enrollInCourse(courseId);
        dispatch(addEnrollment(newEnrollment));
        setError(null);
      } catch (err) {
        console.error("Error enrolling", err);
        setError("Unable to enroll in course.");
      }
    }
  };

  const handleCourseNavigation = (
    e: MouseEvent<HTMLButtonElement>,
    courseId: string
  ) => {
    e.preventDefault();
    if (isEnrolled(courseId)) {
      router.push(`/Courses/${courseId}/Home`);
    }
  };

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 id="wd-dashboard-title" className="mb-0">
          Dashboard
        </h1>
        <Button
          variant="primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-toggle"
        >
          {showAllCourses ? "Show Enrolled Courses" : "Enrollments"}
        </Button>
      </div>
      <hr />
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={onUpdateCourse}
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({filteredCourses.length})
      </h2>
      <hr />
      {(isLoadingCourses || isLoadingEnrollments) && (
        <div className="text-muted mb-3">Loading data...</div>
      )}
      {error && !(isLoadingCourses || isLoadingEnrollments) && (
        <div className="alert alert-danger mb-3">{error}</div>
      )}
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: any) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                {isEnrolled(course._id) ? (
                  <Link
                    href={`/Courses/${course._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      src={course.coverImage}
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}
                      </CardText>
                    </CardBody>
                  </Link>
                ) : (
                  <div>
                    <CardImg
                      src={course.coverImage}
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}
                      </CardText>
                    </CardBody>
                  </div>
                )}
                <CardBody>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    {!showAllCourses && isEnrolled(course._id) && (
                      <Button
                        variant="primary"
                        onClick={(e) => handleCourseNavigation(e, course._id)}
                      >
                        Go
                      </Button>
                    )}
                    {showAllCourses && (
                      <Button
                        onClick={(e) => handleEnrollmentToggle(e, course._id)}
                        variant={isEnrolled(course._id) ? "danger" : "success"}
                        id={
                          isEnrolled(course._id)
                            ? "wd-unenroll-btn"
                            : "wd-enroll-btn"
                        }
                      >
                        {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                      </Button>
                    )}
                    {isFaculty && (
                      <>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            onDeleteCourse(course._id);
                          }}
                          variant="danger"
                          id="wd-delete-course-click"
                          className="ms-auto"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setCourse(course);
                          }}
                          variant="warning"
                          id="wd-edit-course-click"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
