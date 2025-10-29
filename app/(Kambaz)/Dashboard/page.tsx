"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { addEnrollment, deleteEnrollment } from "../Courses/enrollmentsReducer";

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { courses } = useSelector((state: any) => state.coursesReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
    coverImage: "/images/reactjs.jpg"
  });
  
  // Helper function to check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser?._id &&
        enrollment.course === courseId
    );
  };
  
  // Helper function to handle enrollment toggle
  const handleEnrollmentToggle = (e: any, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isEnrolled(courseId)) {
      // Unenroll
      const enrollment = enrollments.find(
        (enrollment: any) =>
          enrollment.user === currentUser?._id &&
          enrollment.course === courseId
      );
      if (enrollment) {
        dispatch(deleteEnrollment(enrollment._id));
      }
    } else {
      // Enroll
      dispatch(addEnrollment({ user: currentUser?._id, course: courseId }));
    }
  };
  
  // Helper function to handle course navigation
  const handleCourseNavigation = (e: any, courseId: string) => {
    e.preventDefault();
    if (isEnrolled(courseId)) {
      router.push(`/Courses/${courseId}/Home`);
    }
  };
  
  // Get filtered courses based on showAllCourses state
  const getFilteredCourses = () => {
    if (showAllCourses) {
      return courses;
    } else {
      return courses.filter((course: any) => isEnrolled(course._id));
    }
  };
  
  const filteredCourses = getFilteredCourses();
  
  // Check if current user is faculty
  const isFaculty = currentUser?.role === "FACULTY";
  
  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-enrollments-toggle"
        >
          {showAllCourses ? 'Show Enrolled Courses' : 'Enrollments'}
        </Button>
      </div>
      <hr />
      {isFaculty && (
        <>
          <h5>New Course
            <button className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={() => {
                      dispatch(addNewCourse(course));
                      setCourse({
                        _id: "0",
                        name: "New Course",
                        number: "New Number",
                        startDate: "2023-09-10",
                        endDate: "2023-12-15",
                        image: "/images/reactjs.jpg",
                        description: "New Description",
                        coverImage: "/images/reactjs.jpg"
                      });
                    }}> Add </button>
            <button className="btn btn-warning float-end me-2"
                    id="wd-update-course-click"
                    onClick={() => dispatch(updateCourse(course))}> Update </button>
          </h5>
          <br />
          <FormControl value={course.name}
                       className="mb-2"
                       onChange={(e) => setCourse({ ...course, name: e.target.value })} />
          <FormControl as="textarea"
                       value={course.description}
                       rows={3}
                       onChange={(e) => setCourse({ ...course, description: e.target.value })} />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">Published Courses ({filteredCourses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: any) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                {isEnrolled(course._id) ? (
                  <Link href={`/Courses/${course._id}/Home`}
                        className="wd-dashboard-course-link text-decoration-none text-dark" >
                    <CardImg src={course.coverImage} variant="top" width="100%" height={160} />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name} </CardTitle>
                      <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                        {course.description} </CardText>
                    </CardBody>
                  </Link>
                ) : (
                  <div>
                    <CardImg src={course.coverImage} variant="top" width="100%" height={160} />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name} </CardTitle>
                      <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                        {course.description} </CardText>
                    </CardBody>
                  </div>
                )}
                <CardBody>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    {isEnrolled(course._id) && (
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
                        id={isEnrolled(course._id) ? "wd-unenroll-btn" : "wd-enroll-btn"}
                      >
                        {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                      </Button>
                    )}
                    {isFaculty && (
                      <>
                        <Button onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(deleteCourse(course._id));
                                }}
                                variant="danger"
                                id="wd-delete-course-click"
                                className="ms-auto">
                          Delete
                        </Button>
                        <Button onClick={(e) => {
                                  e.preventDefault();
                                  setCourse(course);
                                }}
                                variant="warning"
                                id="wd-edit-course-click">
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
