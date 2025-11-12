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
      const currentUser = await client.profile();
      if (currentUser) {
        dispatch(setCurrentUser(currentUser));
      } else {
        dispatch(setCurrentUser(null));
      }
    } catch (error) {
      dispatch(setCurrentUser(null));
      console.error("Unable to fetch profile", error);
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
