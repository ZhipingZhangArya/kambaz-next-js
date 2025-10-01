'use client';

import { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface CoursesLayoutProps {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  const pathname = usePathname();
  
  // Extract course ID and current page from pathname
  const pathParts = pathname.split('/');
  const cid = pathParts[2]; // Course ID
  const currentPage = pathParts[3] || 'Home'; // Current page (Home, Modules, Assignments, etc.)
  
  // Convert page name to display format
  const getPageDisplayName = (page: string) => {
    switch (page.toLowerCase()) {
      case 'home': return 'Home';
      case 'modules': return 'Modules';
      case 'assignments': return 'Assignments';
      case 'quizzes': return 'Quizzes';
      case 'grades': return 'Grades';
      case 'people': return 'People';
      case 'piazza': return 'Piazza';
      case 'zoom': return 'Zoom';
      default: return page.charAt(0).toUpperCase() + page.slice(1);
    }
  };

  return (
    <div id="wd-courses">
      <div className="d-none d-md-block">
        <div className="d-flex align-items-center mb-3">
          <FaAlignJustify className="text-danger me-3 fs-4" />
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <span className="text-danger fw-bold">Course {cid}</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {getPageDisplayName(currentPage)}
              </li>
            </ol>
          </nav>
        </div>
        <hr />
      </div>
      
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
