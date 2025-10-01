'use client';

import { ReactNode, useState, useEffect, useRef } from "react";
import KambazNavigation from "./Navigation";
import { FaAlignJustify, FaChevronDown, FaTimes, FaRegCircle, FaInbox } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  console.log('Drawer state:', isDrawerOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCourseDropdownOpen(false);
      }
    };

    if (isCourseDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCourseDropdownOpen]);
  
  // Determine the page title based on the current path
  const getPageTitle = () => {
    if (pathname === '/Dashboard') {
      return { title: 'Dashboard', subtitle: '' };
    } else if (pathname.startsWith('/Courses/')) {
      const courseMatch = pathname.match(/\/Courses\/(\d+)/);
      if (courseMatch) {
        const courseId = courseMatch[1];
        if (pathname.includes('/Home')) {
          return { title: `Course ${courseId}`, subtitle: 'Home' };
        } else if (pathname.includes('/Modules')) {
          return { title: `Course ${courseId}`, subtitle: 'Modules' };
        } else if (pathname.includes('/Assignments')) {
          return { title: `Course ${courseId}`, subtitle: 'Assignments' };
        } else if (pathname.includes('/Quizzes')) {
          return { title: `Course ${courseId}`, subtitle: 'Quizzes' };
        } else if (pathname.includes('/Grades')) {
          return { title: `Course ${courseId}`, subtitle: 'Grades' };
        } else if (pathname.includes('/People')) {
          return { title: `Course ${courseId}`, subtitle: 'People' };
        } else {
          return { title: `Course ${courseId}`, subtitle: 'Home' };
        }
      }
    } else if (pathname === '/Account') {
      return { title: 'Account', subtitle: '' };
    } else if (pathname === '/Calendar') {
      return { title: 'Calendar', subtitle: '' };
    } else if (pathname === '/Inbox') {
      return { title: 'Inbox', subtitle: '' };
    } else if (pathname === '/Labs') {
      return { title: 'Labs', subtitle: '' };
    }
    
    // Default fallback
    return { title: 'Kambaz', subtitle: '' };
  };

  const { title, subtitle } = getPageTitle();

  // Check if we're on a course page
  const isCoursePage = pathname.startsWith('/Courses/');

  const toggleDrawer = () => {
    console.log('Toggle drawer clicked, current state:', isDrawerOpen);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    console.log('Close drawer called');
    setIsDrawerOpen(false);
  };

  const toggleCourseDropdown = () => {
    setIsCourseDropdownOpen(!isCourseDropdownOpen);
  };

  const closeCourseDropdown = () => {
    setIsCourseDropdownOpen(false);
  };

  return (
    <div id="wd-kambaz">
      {/* Mobile Header */}
      <div className="d-flex justify-content-between align-items-center bg-dark text-white p-2 d-md-none mobile-header">
        <button 
          className="btn btn-link text-white p-0 border-0"
          onClick={toggleDrawer}
          aria-label="Open navigation menu"
        >
          <FaAlignJustify className="fs-4" />
        </button>
        <div className="text-center">
          <div className="fw-bold">{title}</div>
          {subtitle && <div>{subtitle}</div>}
        </div>
        {isCoursePage ? (
          <button 
            className="btn btn-link text-white p-0 border-0"
            onClick={toggleCourseDropdown}
            aria-label="Open course navigation menu"
          >
            <FaChevronDown className="fs-4" />
          </button>
        ) : (
          <div style={{ width: '24px' }}></div>
        )}
        
        {/* Course Dropdown Menu */}
        {isCoursePage && isCourseDropdownOpen && (
          <div className="course-dropdown-menu d-md-none" ref={dropdownRef}>
            <div className="dropdown-list">
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/Home`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">Home</span>
              </Link>
              
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/Modules`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">Modules</span>
              </Link>
              
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/Piazza`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">Piazza</span>
              </Link>
              
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/Zoom`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">Zoom</span>
              </Link>
              
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/Assignments`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">Assignments</span>
              </Link>
              
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/Quizzes`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">Quizzes</span>
              </Link>
              
              <Link 
                href={`/Courses/${pathname.split('/')[2]}/People/Table`}
                className="dropdown-item"
                onClick={closeCourseDropdown}
              >
                <span className="text-danger fs-6">People</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {isDrawerOpen && (
        <div className="mobile-drawer-overlay d-md-none" onClick={closeDrawer} style={{ display: isDrawerOpen ? 'flex' : 'none' }}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center">
                  <Image src="/neulogo.png" width={66} height={66} alt="Northeastern University" className="me-3" />
                  <span className="fw-bold text-danger" style={{ fontSize: '3rem' }}>KAMBAZ</span>
                </div>
              <button 
                className="btn btn-link text-dark p-0 border-0"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
              >
                <FaTimes className="fs-4" />
              </button>
            </div>
            
            <nav className="p-0">
              <div className="list-group list-group-flush">
                <Link 
                  href="/Account" 
                  className="list-group-item list-group-item-action d-flex align-items-center py-3"
                  onClick={closeDrawer}
                >
                  <FaRegCircle className="text-danger me-3 fs-1" />
                  <div className="text-danger fs-4">Account</div>
                </Link>
                
                <Link 
                  href="/Dashboard" 
                  className="list-group-item list-group-item-action d-flex align-items-center py-3"
                  onClick={closeDrawer}
                >
                  <AiOutlineDashboard className="text-danger me-3 fs-1" />
                  <div className="text-danger fs-4">Dashboard</div>
                </Link>
                
                <Link 
                  href="/Dashboard" 
                  className="list-group-item list-group-item-action d-flex align-items-center py-3"
                  onClick={closeDrawer}
                >
                  <LiaBookSolid className="text-danger me-3 fs-1" />
                  <div className="text-danger fs-4">Courses</div>
                </Link>
                
                <Link 
                  href="/Calendar" 
                  className="list-group-item list-group-item-action d-flex align-items-center py-3"
                  onClick={closeDrawer}
                >
                  <IoCalendarOutline className="text-danger me-3 fs-1" />
                  <div className="text-danger fs-4">Calendar</div>
                </Link>
                
                <Link 
                  href="/Inbox" 
                  className="list-group-item list-group-item-action d-flex align-items-center py-3"
                  onClick={closeDrawer}
                >
                  <FaInbox className="text-danger me-3 fs-1" />
                  <div className="text-danger fs-4">Inbox</div>
                </Link>
                
                <Link 
                  href="/Labs" 
                  className="list-group-item list-group-item-action d-flex align-items-center py-3"
                  onClick={closeDrawer}
                >
                  <LiaCogSolid className="text-danger me-3 fs-1" />
                  <div className="text-danger fs-4">Labs</div>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      <div className="d-flex">
        <div>
          <KambazNavigation />
        </div>
        <div className="wd-main-content-offset p-3 flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
