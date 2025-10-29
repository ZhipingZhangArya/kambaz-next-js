"use client";
import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { FaAlignJustify } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  const { cid } = useParams();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { courses } = useSelector((state: any) => state.coursesReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  
  const course = courses.find((course: any) => course._id === cid);
  const [showNavigation, setShowNavigation] = useState(true);
  
  // Check if user is enrolled in this course
  const isEnrolled = enrollments.some(
    (enrollment: any) =>
      enrollment.user === currentUser?._id &&
      enrollment.course === cid
  );
  
  // Redirect to Dashboard if user is not enrolled
  useEffect(() => {
    if (currentUser && !isEnrolled) {
      router.push('/Dashboard');
    }
  }, [currentUser, isEnrolled, router, cid]);
  
  const toggleNavigation = () => {
    setShowNavigation(!showNavigation);
  };
  
  // Don't render course content if user is not enrolled
  if (!isEnrolled) {
    return null;
  }
  
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify 
          className="me-4 fs-4 mb-1" 
          onClick={toggleNavigation}
          style={{ cursor: 'pointer' }}
        />
        <Breadcrumb course={course} />
      </h2>
      
      <div className="d-flex">
        {showNavigation && (
          <div className="d-none d-md-block">
            <CourseNavigation cid={cid as string} />
          </div>
        )}
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
