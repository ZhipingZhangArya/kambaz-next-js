"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Session({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      // profile() returns null for 401 errors (user not authenticated)
      // This is expected behavior and handled gracefully
      const currentUser = await client.profile();
      if (currentUser) {
        dispatch(setCurrentUser(currentUser));
      } else {
        dispatch(setCurrentUser(null));
      }
    } catch (error: any) {
      // Only log non-401 errors (network errors, 500 errors, etc.)
      // 401 errors are handled in client.profile() by returning null
      console.error("Unable to fetch profile", error);
      dispatch(setCurrentUser(null));
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pending) {
    return null;
  }

  return <>{children}</>;
}
