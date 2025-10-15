"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CourseNavigationProps {
  cid: string;
}

export default function CourseNavigation({ cid }: CourseNavigationProps) {
  const pathname = usePathname();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const isActive = pathname.includes(`/Courses/${cid}/${link}`);
        const linkId = link.toLowerCase();
        const href = link === "People" ? `/Courses/${cid}/${link}/Table` : `/Courses/${cid}/${link}`;
        
        return (
          <Link 
            key={link}
            href={href}
            id={`wd-course-${linkId}-link`}
            className={`list-group-item border-0 ${isActive ? "active" : "text-danger"}`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
