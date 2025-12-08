"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import assignments from "../../Database/assignments.json";
import { Assignment } from "../../Database";
import * as quizzesClient from "./Quizzes/client";

export default function Breadcrumb({ course }: { course: { name: string } | undefined }) {
  const pathname = usePathname();
  const { cid, aid, qid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const [quizName, setQuizName] = useState<string | null>(null);
  
  // Extract the current section from the pathname
  const pathSegments = pathname.split("/");
  const currentSection = pathSegments[pathSegments.length - 1];
  
  // Handle quiz editor breadcrumb
  useEffect(() => {
    if (pathname.includes("/Quizzes/") && qid && qid !== "new") {
      // First try to find quiz in Redux store
      const quiz = quizzes.find((q: any) => q._id === qid);
      if (quiz) {
        setQuizName(quiz.title || `Quiz ${qid}`);
      } else {
        // If not in store, fetch from API
        quizzesClient.findQuizById(qid as string)
          .then((quizData) => {
            setQuizName(quizData?.title || `Quiz ${qid}`);
          })
          .catch(() => {
            setQuizName(`Quiz ${qid}`);
          });
      }
    } else {
      setQuizName(null);
    }
  }, [pathname, qid, quizzes]);
  
  // Handle quiz editor breadcrumb
  if (pathname.includes("/Quizzes/") && qid && qid !== "new") {
    const displayQuizName = quizName || `Quiz ${qid}`;
    return (
      <span>
        <span className="text-danger">{course?.name} &gt; Quizzes &gt; </span>
        <span className="text-muted">{displayQuizName}</span>
      </span>
    );
  }
  
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
