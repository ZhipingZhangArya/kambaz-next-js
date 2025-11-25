"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const pathname = usePathname();
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link 
          key={link}
          href={`/Account/${link}`}
          className={`list-group-item border-0 ${pathname.endsWith(link) ? "active" : "text-danger"}`}
        >
          {link}
        </Link>
      ))}
      {currentUser && (currentUser.role === "ADMIN" || currentUser.role === "FACULTY") && (
        <Link 
          href="/Account/Users"
          className={`list-group-item border-0 ${pathname.endsWith("Users") ? "active" : "text-danger"}`}
        >
          Users
        </Link>
      )}
    </div>
  );
}
