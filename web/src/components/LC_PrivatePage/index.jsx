import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "services/Context";

export default ({ children }) => {
  const { user, userIsLoading } = useAppContext();

  if (!user?.id && !userIsLoading) return <Navigate to="/" replace />;
  return <section>{children}</section>;
};
