"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";
import assignments from "../../Database/assignments.json";
import { Assignment } from "../../Database";

export default function Breadcrumb({ course }: { course: { name: string } | undefined }) {
  const pathname = usePathname();
  const { cid, aid } = useParams();
  
  // Extract the current section from the pathname
  const pathSegments = pathname.split("/");
  const currentSection = pathSegments[pathSegments.length - 1];
  
  // Handle assignment editor breadcrumb
  if (pathname.includes("/Assignments/") && aid) {
    const assignment = (assignments as Assignment[])
      .find((a: Assignment) => a._id === aid && a.course === cid);
    const assignmentName = assignment?.title || `Assignment ${aid}`;
    
    return (
      <span>
        <span className="text-danger">{course?.name} &gt; Assignments &gt; </span>
        <span className="text-muted">{assignmentName}</span>
      </span>
    );
  }
  
  // Handle special cases for People section
  const displaySection = currentSection === "Table" ? "People" : currentSection;
  
  return (
    <span>
      <span className="text-danger">{course?.name} &gt; </span>
      <span className="text-muted">{displaySection}</span>
    </span>
  );
}
