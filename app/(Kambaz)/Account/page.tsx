"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const router = useRouter();
  
  useEffect(() => {
    if (!currentUser) {
      router.push("/Account/Signin");
    } else {
      router.push("/Account/Profile");
    }
  }, [currentUser, router]);
  
  return <div>Loading...</div>;
}
