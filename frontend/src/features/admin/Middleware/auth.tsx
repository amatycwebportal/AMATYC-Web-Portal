import type { ReactNode, FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User, UserRole } from "@shared/types";
import Unauthorized from "../../unauthorized/unauthorized";
import { useFetchUser } from "../../../utils/hooks/auth/useFetchUser";

interface AuthProps {
  children: ReactNode;
}

/**
 * Fetches the current authenticated user from the backend.
 */


export const AdminAuthGuard: FC<AuthProps> = ({ children }) => {
    const { user, isLoadingUser, hasUserError } = useFetchUser();


    if (isLoadingUser) {
    return <div>Loading...</div>;
  }

  if (hasUserError) {
    return <Unauthorized />;
  }

  if (!user || (user.role as UserRole !== "PROJECT_LEAD" && user.role as UserRole !== "LOCAL_LEADER")) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};
