'use client';

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
  const pathname = usePathname();
  
  // Helper function to determine if a navigation item is active
  const isActive = (path: string) => {
    if (path === '/Dashboard') {
      return pathname === '/Dashboard';
    }
    return pathname.startsWith(path);
  };
  
  // Helper function to get the appropriate classes for a navigation item
  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active 
      ? "border-0 bg-white text-center"
      : "border-0 bg-black text-center";
  };
  
  // Helper function to get the appropriate link classes for a navigation item
  const getLinkClasses = (path: string) => {
    const active = isActive(path);
    return active
      ? "text-danger text-decoration-none"
      : "text-white text-decoration-none";
  };
  
  // Helper function to get the appropriate icon classes for a navigation item
  const getIconClasses = (path: string) => {
    const active = isActive(path);
    return active
      ? "fs-1 text-danger"
      : "fs-1 text-white";
  };

  return (
    <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 120 }}
               id="wd-kambaz-navigation">
      <ListGroupItem className="bg-black border-0 text-center" as="a"
               target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
        <Image src="/neulogo.png" width={75} height={75} alt="Northeastern University" />
      </ListGroupItem>
      <ListGroupItem className={getNavClasses('/Account')}>
        <Link href="/Account" id="wd-account-link" className={getLinkClasses('/Account')}>
          <FaRegCircleUser className={getIconClasses('/Account')} />
          <br />
          Account
        </Link>
      </ListGroupItem>
      <ListGroupItem className={getNavClasses('/Dashboard')}>
        <Link href="/Dashboard" id="wd-dashboard-link" className={getLinkClasses('/Dashboard')}>
          <AiOutlineDashboard className={getIconClasses('/Dashboard')} />
          <br />
          Dashboard
        </Link>
      </ListGroupItem>
      <ListGroupItem className={getNavClasses('/Courses')}>
        <Link href="/Courses/1234/Home" id="wd-course-link" className={getLinkClasses('/Courses')}>
          <LiaBookSolid className={getIconClasses('/Courses')} />
          <br />
          Courses
        </Link>
      </ListGroupItem>
      <ListGroupItem className={getNavClasses('/Calendar')}>
        <Link href="/Calendar" id="wd-calendar-link" className={getLinkClasses('/Calendar')}>
          <IoCalendarOutline className={getIconClasses('/Calendar')} />
          <br />
          Calendar
        </Link>
      </ListGroupItem>
      <ListGroupItem className={getNavClasses('/Inbox')}>
        <Link href="/Inbox" id="wd-inbox-link" className={getLinkClasses('/Inbox')}>
          <FaInbox className={getIconClasses('/Inbox')} />
          <br />
          Inbox
        </Link>
      </ListGroupItem>
      <ListGroupItem className={getNavClasses('/Labs')}>
        <Link href="/Labs" id="wd-labs-link" className={getLinkClasses('/Labs')}>
          <LiaCogSolid className={getIconClasses('/Labs')} />
          <br />
          Labs
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
