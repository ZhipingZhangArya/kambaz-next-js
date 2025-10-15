import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { FaAlignJustify } from "react-icons/fa6";
import { courses } from "../../Database";

interface CoursesLayoutProps {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}

export default async function CoursesLayout({ children, params }: CoursesLayoutProps) {
  const { cid } = await params;
  const course = courses.find((course) => course._id === cid);
  
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        <Breadcrumb course={course} />
      </h2>
      
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
