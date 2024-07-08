import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "services/Context";

const PrvatePage = ({ children }) => {
  const { user, userIsLoading } = useAppContext();

  console.log(user, userIsLoading);

  if (!user?.id && !userIsLoading) return <Navigate to="/" replace />;
  return <section>{children}</section>;
};

export default PrvatePage;
